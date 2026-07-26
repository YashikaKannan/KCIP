import os
import json
import logging
from sql_parser import parse_sql_file

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("GenerateAPIModels")

def get_python_type(sql_type, nullable):
    sql_type = sql_type.upper()
    py_type = "str"
    if sql_type in ('INT', 'SMALLINT', 'TINYINT', 'BIGINT'):
        py_type = "int"
    elif sql_type in ('DECIMAL', 'FLOAT', 'DOUBLE'):
        py_type = "float"
    elif sql_type in ('BOOLEAN', 'BIT'):
        py_type = "bool"
    elif sql_type in ('DATE', 'DATETIME', 'TIMESTAMP'):
        py_type = "str" # Keep string/ISO format for simple dataclass serialization
        
    if nullable:
        return f"Optional[{py_type}]"
    return py_type

def generate():
    models_dir = "database/generated/api_models"
    os.makedirs(models_dir, exist_ok=True)
    
    op_tables = parse_sql_file("database/schema.sql")
    ai_tables = parse_sql_file("database/intelligence_tables.sql")
    all_tables = op_tables + ai_tables
    
    api_models_json = {}
    
    for t in all_tables:
        t_name = t["name"]
        
        # Generate Dataclass code
        class_lines = [
            "from dataclasses import dataclass",
            "from typing import Optional, List, Dict, Any",
            "",
            "@dataclass",
            f"class {t_name}:",
            f"    \"\"\""
        ]
        if t.get("comment"):
            class_lines.append(f"    {t['comment']}")
        else:
            class_lines.append(f"    Representing Table {t_name} from KCIP Database.")
        class_lines.append("    \"\"\"")
        
        # Track fields for JSON mapping
        fields_json = {}
        for col in t["columns"]:
            py_type = get_python_type(col["sql_type"], col["nullable"])
            default_str = ""
            if col["nullable"]:
                default_str = " = None"
            elif col["default"] is not None:
                # Handle boolean bit conversion or raw strings
                if col["default"] in ('1', '0', 'true', 'false'):
                    val = "True" if col["default"] in ('1', 'true') else "False"
                    default_str = f" = {val}"
                else:
                    default_str = f" = \"{col['default']}\""
                    
            class_lines.append(f"    {col['name']}: {py_type}{default_str}")
            fields_json[col["name"]] = {
                "type": py_type,
                "sql_type": col["sql_type"],
                "nullable": col["nullable"],
                "default": col["default"]
            }
            
        class_lines.append("")
        class_lines.append("    def to_dict(self) -> dict:")
        class_lines.append("        return self.__dict__")
        
        # Write individual Python model
        model_file = os.path.join(models_dir, f"{t_name}.py")
        with open(model_file, "w", encoding="utf-8") as f:
            f.write("\n".join(class_lines))
            
        api_models_json[t_name] = {
            "table_name": t_name,
            "fields": fields_json,
            "primary_keys": t["primary_keys"]
        }
        
    # Write api_models.json
    with open("database/generated/api_models.json", "w", encoding="utf-8") as f:
        json.dump(api_models_json, f, indent=2)
        
    logger.info(f"Generated {len(all_tables)} Python models in database/generated/api_models/ and compiled database/generated/api_models.json")

if __name__ == "__main__":
    generate()
