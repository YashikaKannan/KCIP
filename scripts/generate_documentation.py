import os
import datetime
import logging
from sql_parser import parse_sql_file

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("GenerateDocumentation")

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

def generate():
    os.makedirs("database/generated", exist_ok=True)
    
    op_tables = parse_sql_file("database/schema.sql")
    ai_tables = parse_sql_file("database/intelligence_tables.sql")
    all_tables = op_tables + ai_tables
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Generate deployment_report.md
    report_content = f"""# Database Deployment Report

**Generation Timestamp**: {timestamp}

## Summary
- **Total Tables**: {len(all_tables)}
- **Operational Tables (schema.sql)**: {len(op_tables)}
- **Intelligence Tables (intelligence_tables.sql)**: {len(ai_tables)}
- **Total Columns**: {sum(len(t["columns"]) for t in all_tables)}

## Tables Generated
"""
    for t in all_tables:
        layer = "Operational" if t in op_tables else "Intelligence"
        report_content += f"- **{t['name']}** ({layer} Layer) — {len(t['columns'])} columns\n"

    report_content += "\n## Relationships\n"
    relationships_found = False
    for t in all_tables:
        for fk in t["foreign_keys"]:
            relationships_found = True
            report_content += f"- `{t['name']}.{', '.join(fk['columns'])}` references `{fk['references_table']}({', '.join(fk['references_columns'])})`\n"
    if not relationships_found:
        report_content += "No foreign key relationships detected.\n"

    report_content += """
## Warnings & Unsupported SQL Features
Zoho Catalyst Data Store does not support:
- **Foreign Keys / Referential Actions** (`ON DELETE`, `ON UPDATE`). Configured at API level or manually via console relations.
- **Check Constraints** (`CHECK (cstype IN ('A', 'B', 'C'))`). Must be validated inside Serverless Functions.
- **Triggers** (`CREATE TRIGGER`). Handled using Catalyst Signals.
- **Stored Procedures** (`CREATE PROCEDURE`). Handled using serverless APIs.
- **Views** (`CREATE VIEW`). Handled using custom search indexers or API cache aggregations.

## Catalyst Compatibility Notes
- Column types are mapped to `VarChar`, `Int`, `BigInt`, `Double`, `Text`, `DateTime`, and `Boolean`.
- Composite primary keys are mapped to table relation mappings or unique composite indices managed in Java/Python.
"""
    with open("database/generated/deployment_report.md", "w", encoding="utf-8") as f:
        f.write(report_content)
    logger.info("Generated database/generated/deployment_report.md")

    # 2. Generate catalyst_manual_deployment.md
    deployment_content = f"""# Zoho Catalyst Manual Data Store Deployment Guide

**Generated on**: {timestamp}
Use this document as an step-by-step layout for configuring the Catalyst Console manually.

"""
    for t in all_tables:
        deployment_content += f"=================================================\n"
        deployment_content += f"TABLE: {t['name']}\n"
        deployment_content += f"=================================================\n"
        
        for col in t["columns"]:
            c_type = get_catalyst_type(col["sql_type"])
            mand_str = "Yes" if col["mandatory"] else "No"
            pk_str = "Yes" if col["name"] in t["primary_keys"] else "No"
            auto_str = "Yes" if col["auto_increment"] else "No"
            uniq_str = "Yes" if col["unique"] else "No"
            
            deployment_content += f"Column Name      : {col['name']}\n"
            deployment_content += f"  Type           : {c_type}\n"
            if c_type == 'VarChar' and isinstance(col["length"], int):
                deployment_content += f"  Max Length     : {col['length']}\n"
            deployment_content += f"  Mandatory      : {mand_str}\n"
            deployment_content += f"  Primary Key    : {pk_str}\n"
            if auto_str == "Yes":
                deployment_content += f"  Auto Increment : {auto_str}\n"
            if uniq_str == "Yes":
                deployment_content += f"  Unique         : {uniq_str}\n"
            if col["default"]:
                deployment_content += f"  Default Value  : {col['default']}\n"
            if col["comment"]:
                deployment_content += f"  Description    : {col['comment']}\n"
            deployment_content += f"-------------------------------------------------\n"
        deployment_content += "\n"

    with open("database/generated/catalyst_manual_deployment.md", "w", encoding="utf-8") as f:
        f.write(deployment_content)
    logger.info("Generated database/generated/catalyst_manual_deployment.md")

if __name__ == "__main__":
    generate()
