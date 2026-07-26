import os
import json
import logging
import datetime
from sql_parser import parse_sql_file

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ValidateSchema")

def get_catalyst_type(sql_type):
    sql_type = sql_type.upper()
    if sql_type in ('VARCHAR', 'CHAR'):
        return 'VarChar'
    elif sql_type in ('INT', 'SMALLINT', 'TINYINT'):
        return 'Int'
    elif sql_type in ('BIGINT',):
        return 'BigInt'
    elif sql_type in ('DECIMAL', 'FLOAT', 'DOUBLE'):
        return 'Double'
    elif sql_type in ('TEXT', 'LONGTEXT', 'JSON'):
        return 'Text'
    elif sql_type in ('DATE', 'DATETIME', 'TIMESTAMP'):
        return 'DateTime'
    elif sql_type in ('BOOLEAN', 'BIT'):
        return 'Boolean'
    return 'VarChar'

def validate():
    # 1. Parse source SQL files
    op_tables = parse_sql_file("database/schema.sql")
    ai_tables = parse_sql_file("database/intelligence_tables.sql")
    sql_tables = {t["name"]: t for t in (op_tables + ai_tables)}

    # 2. Read datastore-schema.json
    schema_path = "database/generated/datastore-schema.json"
    if not os.path.exists(schema_path):
        logger.error("Generated datastore-schema.json not found. Run generate_datastore.py first.")
        return False

    with open(schema_path, "r", encoding="utf-8") as f:
        datastore_schema = json.load(f)

    json_tables = {t["name"]: t for t in datastore_schema.get("tables", [])}

    issues = []
    
    # Check for missing/extra tables
    for t_name in sql_tables:
        if t_name not in json_tables:
            issues.append(f"Missing Table: Table `{t_name}` is defined in SQL but missing in datastore-schema.json.")
            
    for t_name in json_tables:
        if t_name not in sql_tables:
            issues.append(f"Extra Table: Table `{t_name}` exists in datastore-schema.json but not in SQL.")

    # Column level checks
    for t_name, sql_table in sql_tables.items():
        if t_name not in json_tables:
            continue
            
        json_table = json_tables[t_name]
        sql_cols = {c["name"]: c for c in sql_table["columns"]}
        json_cols = {c["name"]: c for c in json_table["columns"]}
        
        # Check duplicate columns in SQL
        col_names = [c["name"] for c in sql_table["columns"]]
        if len(col_names) != len(set(col_names)):
            dups = set([x for x in col_names if col_names.count(x) > 1])
            issues.append(f"Table `{t_name}`: Contains duplicate columns in SQL schema: {dups}")

        # Check for missing columns
        for c_name in sql_cols:
            if c_name not in json_cols:
                issues.append(f"Table `{t_name}`: Column `{c_name}` is defined in SQL but missing in JSON.")
                
        for c_name in json_cols:
            if c_name not in sql_cols:
                issues.append(f"Table `{t_name}`: Column `{c_name}` exists in JSON but not in SQL.")

        # Check attribute properties
        for c_name, sql_col in sql_cols.items():
            if c_name not in json_cols:
                continue
            json_col = json_cols[c_name]
            
            # Datatype match
            expected_c_type = get_catalyst_type(sql_col["sql_type"])
            if json_col["type"] != expected_c_type:
                issues.append(f"Table `{t_name}`, Column `{c_name}`: Type mismatch. SQL type maps to `{expected_c_type}`, but JSON has `{json_col['type']}`.")

            # Max Length check
            if expected_c_type == 'VarChar' and isinstance(sql_col["length"], int):
                json_len = json_col.get("max_length")
                if json_len != sql_col["length"]:
                    issues.append(f"Table `{t_name}`, Column `{c_name}`: Max length mismatch. SQL defines `{sql_col['length']}`, JSON has `{json_len}`.")

            # Mandatory check
            if json_col["is_mandatory"] != sql_col["mandatory"]:
                issues.append(f"Table `{t_name}`, Column `{c_name}`: Nullability/mandatory mismatch. SQL mandatory=`{sql_col['mandatory']}`, JSON is_mandatory=`{json_col['is_mandatory']}`.")

            # Uniqueness check
            is_unique_in_json = json_col.get("is_unique", False)
            if sql_col["unique"] and not is_unique_in_json:
                issues.append(f"Table `{t_name}`, Column `{c_name}`: Uniqueness mismatch. SQL specifies UNIQUE, but JSON is_unique is false.")

    # Generate a validation report
    report_lines = [
        "# Database Schema Validation Report",
        f"**Run Date**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"**Status**: {'❌ FAILED' if issues else '✅ PASSED'}",
        "",
        "## Validation Summary",
        f"- Total tables analyzed: {len(sql_tables)}",
        f"- Mismatches or issues found: {len(issues)}",
        "",
        "## Issues & Discrepancies Details"
    ]
    if issues:
        for i in issues:
            report_lines.append(f"- {i}")
    else:
        report_lines.append("No mismatches found. The generated datastore-schema.json aligns perfectly with the source of truth DDL schema.")

    with open("database/generated/schema_validation_report.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    
    logger.info(f"Schema Validation completed with status: {'FAILED' if issues else 'PASSED'}")
    return len(issues) == 0

if __name__ == "__main__":
    validate()
