import os
import json
import logging
from datetime import datetime

# Set up pathing to import config relatively
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import catalyst_config

# Set up logging to console and logfile
log_format = '%(asctime)s - %(levelname)s - %(message)s'
logging.basicConfig(
    level=logging.INFO,
    format=log_format,
    handlers=[
        logging.FileHandler(os.path.join(catalyst_config.LOG_DIR, "deployment.log"), encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("CatalystDeployer")

class DeploymentAssistant:
    def __init__(self):
        self.schema_path = catalyst_config.SCHEMA_PATH
        self.state_file = catalyst_config.STATE_FILE
        self.state = self._load_state()

    def _load_state(self):
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load state file: {e}. Starting fresh.")
        return {"processed_tables": [], "last_run": None}

    def _save_state(self):
        self.state["last_run"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2)
            logger.info("Saved deployment state successfully.")
        except Exception as e:
            logger.error(f"Failed to save state file: {e}")

    def run_dry_run(self):
        logger.info("Starting Catalyst Deployment preparation...")
        if not os.path.exists(self.schema_path):
            logger.error(f"Schema file not found at {self.schema_path}. Run datastore generator first.")
            return

        with open(self.schema_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        tables = data.get("tables", [])
        
        # 1. Audit Duplicates
        table_names = [t["name"] for t in tables]
        duplicate_tables = set([x for x in table_names if table_names.count(x) > 1])
        if duplicate_tables:
            logger.warning(f"Duplicate tables detected in schema definitions: {duplicate_tables}")
        
        processed_count = 0
        skipped_count = 0
        
        logger.info(f"Total tables detected in schema file: {len(tables)}")
        print("\n" + "="*80)
        print("                 CATALYST DATA STORE SCHEMA PREPARATION REPORT")
        print("="*80)

        for t in tables:
            t_name = t["name"]
            
            # Check for duplicate columns inside the table
            col_names = [c["name"] for c in t.get("columns", [])]
            duplicate_cols = set([x for x in col_names if col_names.count(x) > 1])
            if duplicate_cols:
                logger.warning(f"Table `{t_name}` contains duplicate column definitions: {duplicate_cols}")

            # Check if table was already processed/skipped
            if t_name in self.state.get("processed_tables", []):
                logger.info(f"Skipping table `{t_name}` (already marked as deployed/processed).")
                skipped_count += 1
                continue

            print(f"\nTABLE: {t_name}")
            print("-" * 50)
            print(f"{'Column Name':<25} | {'Datatype':<10} | {'Length':<8} | {'Mandatory':<9} | {'Unique':<6}")
            print("-" * 50)
            
            for col in t.get("columns", []):
                c_name = col["name"]
                c_type = col["type"]
                length = str(col.get("max_length", "-"))
                mandatory = "Yes" if col.get("is_mandatory", False) else "No"
                unique = "Yes" if col.get("is_unique", False) else "No"
                print(f"{c_name:<25} | {c_type:<10} | {length:<8} | {mandatory:<9} | {uniq_str:<6}" 
                      if 'uniq_str' in locals() else 
                      f"{c_name:<25} | {c_type:<10} | {length:<8} | {mandatory:<9} | {unique:<6}")
            
            processed_count += 1
            # Mark as processed in our state registry
            self.state["processed_tables"].append(t_name)

        print("\n" + "="*80)
        print("                             DEPLOYMENT SUMMARY")
        print("="*80)
        print(f"Total Tables Evaluated : {len(tables)}")
        print(f"Tables Prepared        : {processed_count}")
        print(f"Tables Skipped         : {skipped_count}")
        print(f"Duplicate Tables Found : {len(duplicate_tables)}")
        print("="*80 + "\n")
        
        # Save state configuration
        self._save_state()
        logger.info("Deployment assistant completed review run successfully.")

if __name__ == "__main__":
    assistant = DeploymentAssistant()
    assistant.run_dry_run()
