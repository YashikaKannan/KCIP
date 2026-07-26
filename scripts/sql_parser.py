import re
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("SQLParser")

def parse_sql_file(filepath):
    if not os.path.exists(filepath):
        logger.error(f"File not found: {filepath}")
        return []

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove SQL comments and empty lines
    # Block comments /* ... */
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    tables = []
    
    # Simple state machine to extract CREATE TABLE statements
    # Match CREATE TABLE statements, handling backticks and IF NOT EXISTS
    table_matches = re.finditer(
        r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\((.*?)\)\s*(?:ENGINE|DEFAULT|COLLATE|COMMENT|$)',
        content,
        re.DOTALL | re.IGNORECASE
    )

    for match in table_matches:
        table_name = match.group(1)
        body = match.group(2)
        
        table_obj = {
            "name": table_name,
            "columns": [],
            "primary_keys": [],
            "foreign_keys": [],
            "unique_keys": []
        }
        
        # Split body by commas, but ignore commas inside parentheses (e.g. DECIMAL(10,8))
        lines = []
        current_line = []
        paren_depth = 0
        quote_char = None
        
        for char in body:
            if char == ',' and paren_depth == 0 and quote_char is None:
                lines.append("".join(current_line).strip())
                current_line = []
            else:
                if char in ('(', '['):
                    paren_depth += 1
                elif char in (')', ']'):
                    paren_depth = max(0, paren_depth - 1)
                elif char in ("'", '"', "`"):
                    if quote_char == char:
                        quote_char = None
                    elif quote_char is None:
                        quote_char = char
                current_line.append(char)
        if current_line:
            lines.append("".join(current_line).strip())

        # Parse lines
        for line in lines:
            if not line:
                continue
            
            # Check for constraints
            line_upper = line.upper()
            
            if line_upper.startswith("PRIMARY KEY"):
                # Composite PRIMARY KEY (`Col1`, `Col2`)
                pk_cols = re.findall(r'[`"]?(\w+)[`"]?', line.split("KEY")[1])
                table_obj["primary_keys"].extend(pk_cols)
                continue
                
            if line_upper.startswith("CONSTRAINT") and "FOREIGN KEY" in line_upper:
                fk_match = re.search(
                    r'CONSTRAINT\s+[`"]?(\w+)[`"]?\s+FOREIGN\s+KEY\s*\((.*?)\)\s*REFERENCES\s+[`"]?(\w+)[`"]?\s*\((.*?)\)',
                    line, re.IGNORECASE
                )
                if fk_match:
                    constraint_name = fk_match.group(1)
                    fk_cols = [c.strip(' `"') for c in fk_match.group(2).split(',')]
                    ref_table = fk_match.group(3)
                    ref_cols = [c.strip(' `"') for c in fk_match.group(4).split(',')]
                    
                    table_obj["foreign_keys"].append({
                        "constraint_name": constraint_name,
                        "columns": fk_cols,
                        "references_table": ref_table,
                        "references_columns": ref_cols
                    })
                continue
                
            if line_upper.startswith("FOREIGN KEY"):
                fk_match = re.search(
                    r'FOREIGN\s+KEY\s*\((.*?)\)\s*REFERENCES\s+[`"]?(\w+)[`"]?\s*\((.*?)\)',
                    line, re.IGNORECASE
                )
                if fk_match:
                    fk_cols = [c.strip(' `"') for c in fk_match.group(1).split(',')]
                    ref_table = fk_match.group(2)
                    ref_cols = [c.strip(' `"') for c in fk_match.group(3).split(',')]
                    table_obj["foreign_keys"].append({
                        "columns": fk_cols,
                        "references_table": ref_table,
                        "references_columns": ref_cols
                    })
                continue

            if "UNIQUE KEY" in line_upper or line_upper.startswith("UNIQUE"):
                uq_match = re.search(r'(?:UNIQUE\s+KEY|UNIQUE)\s+[`"]?(\w+)[`"]?\s*\((.*?)\)', line, re.IGNORECASE)
                if uq_match:
                    uq_name = uq_match.group(1)
                    uq_cols = [c.strip(' `"') for c in uq_match.group(2).split(',')]
                    table_obj["unique_keys"].append({
                        "name": uq_name,
                        "columns": uq_cols
                    })
                continue
                
            if line_upper.startswith("KEY") or line_upper.startswith("INDEX"):
                # Normal index, skip parsing as column
                continue
                
            if line_upper.startswith("CHECK"):
                # CHECK constraint, skip or handle as needed
                continue

            # It must be a column definition
            col_match = re.match(r'^[`"]?(\w+)[`"]?\s+([A-Za-z]+)(?:\((.*?)\))?\s*(.*)$', line, re.DOTALL | re.IGNORECASE)
            if col_match:
                col_name = col_match.group(1)
                sql_type = col_match.group(2).upper()
                type_len = col_match.group(3)
                rest = col_match.group(4)
                
                rest_upper = rest.upper()
                
                # Check properties
                is_nullable = "NOT NULL" not in rest_upper
                is_mandatory = not is_nullable
                is_primary = "PRIMARY KEY" in rest_upper
                is_auto = "AUTO_INCREMENT" in rest_upper
                
                # Extract DEFAULT
                default_val = None
                default_match = re.search(r'DEFAULT\s+([^ ]+)', rest, re.IGNORECASE)
                if default_match:
                    default_val = default_match.group(1).strip("'\"` ")
                    if default_val.startswith("b'"):
                        # Binary literal e.g. b'1' -> true
                        default_val = "1" if "1" in default_val else "0"
                
                # Extract UNIQUE
                is_unique = "UNIQUE" in rest_upper
                
                # Extract COMMENT
                comment_val = ""
                comment_match = re.search(r"COMMENT\s+'(.*?)'", rest, re.IGNORECASE)
                if comment_match:
                    comment_val = comment_match.group(1)
                
                # Handle datatype conversions
                length = None
                if type_len:
                    if "," in type_len:
                        # decimal scale/precision e.g. 10,8
                        length = type_len.strip()
                    else:
                        try:
                            length = int(type_len.strip())
                        except ValueError:
                            length = type_len.strip()

                column_obj = {
                    "name": col_name,
                    "sql_type": sql_type,
                    "length": length,
                    "nullable": is_nullable,
                    "mandatory": is_mandatory,
                    "default": default_val,
                    "unique": is_unique,
                    "primary_key": is_primary,
                    "auto_increment": is_auto,
                    "comment": comment_val
                }
                
                table_obj["columns"].append(column_obj)
                
                if is_primary:
                    table_obj["primary_keys"].append(col_name)
                    
        tables.append(table_obj)
        
    return tables

if __name__ == "__main__":
    # Quick debug run
    op_tables = parse_sql_file("database/schema.sql")
    ai_tables = parse_sql_file("database/intelligence_tables.sql")
    print(f"Parsed {len(op_tables)} operational tables and {len(ai_tables)} intelligence tables.")
