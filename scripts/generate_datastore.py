import os
import json
import datetime
import logging
from sql_parser import parse_sql_file

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("GenerateDatastore")

def get_catalyst_type(sql_type, name=""):
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

def generate():
    os.makedirs("database/generated", exist_ok=True)
    
    op_tables = parse_sql_file("database/schema.sql")
    ai_tables = parse_sql_file("database/intelligence_tables.sql")
    
    all_tables = op_tables + ai_tables
    
    # 1. Generate datastore-schema.json
    datastore_schema = {"tables": []}
    for t in all_tables:
        cols_list = []
        for col in t["columns"]:
            c_type = get_catalyst_type(col["sql_type"], col["name"])
            col_entry = {
                "name": col["name"],
                "type": c_type,
                "is_mandatory": col["mandatory"]
            }
            if c_type == 'VarChar' and isinstance(col["length"], int):
                col_entry["max_length"] = col["length"]
            if col["unique"]:
                col_entry["is_unique"] = True
                
            cols_list.append(col_entry)
            
        datastore_schema["tables"].append({
            "name": t["name"],
            "columns": cols_list
        })
        
    with open("database/generated/datastore-schema.json", "w", encoding="utf-8") as f:
        json.dump(datastore_schema, f, indent=2)
    logger.info("Generated database/generated/datastore-schema.json")

    # 2. Generate catalyst_tables.json (Table name, Column names, Catalyst datatype, Mandatory, Length, Unique, Default)
    catalyst_tables = []
    for t in all_tables:
        cols_list = []
        for col in t["columns"]:
            c_type = get_catalyst_type(col["sql_type"], col["name"])
            cols_list.append({
                "name": col["name"],
                "type": c_type,
                "mandatory": col["mandatory"],
                "length": col["length"] if c_type == 'VarChar' else None,
                "unique": col["unique"] or (col["name"] in t["primary_keys"]),
                "default": col["default"]
            })
        catalyst_tables.append({
            "name": t["name"],
            "columns": cols_list
        })
        
    with open("database/generated/catalyst_tables.json", "w", encoding="utf-8") as f:
        json.dump(catalyst_tables, f, indent=2)
    logger.info("Generated database/generated/catalyst_tables.json")

    # 3. Generate table_metadata.json
    total_cols = sum(len(t["columns"]) for t in all_tables)
    pks = []
    fks = []
    uqs = []
    for t in all_tables:
        pks.extend([f"{t['name']}.{pk}" for pk in t["primary_keys"]])
        for fk in t["foreign_keys"]:
            for col in fk["columns"]:
                fks.append(f"{t['name']}.{col} -> {fk['references_table']}")
        for uq in t["unique_keys"]:
            for col in uq["columns"]:
                uqs.append(f"{t['name']}.{col}")
                
    table_metadata = {
        "total_tables": len(all_tables),
        "operational_tables": len(op_tables),
        "ai_tables": len(ai_tables),
        "total_columns": total_cols,
        "primary_keys_count": len(pks),
        "foreign_keys_count": len(fks),
        "unique_keys_count": len(uqs),
        "primary_keys": pks,
        "foreign_keys": fks,
        "unique_keys": uqs,
        "estimated_relationships": len(fks)
    }
    
    with open("database/generated/table_metadata.json", "w", encoding="utf-8") as f:
        json.dump(table_metadata, f, indent=2)
    logger.info("Generated database/generated/table_metadata.json")

if __name__ == "__main__":
    generate()
