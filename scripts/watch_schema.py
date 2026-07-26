import os
import sys
import time
import subprocess
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("SchemaWatcher")

WATCH_FILES = [
    "database/schema.sql",
    "database/intelligence_tables.sql"
]

def run_command(cmd):
    logger.info(f"Executing: {cmd}")
    res = subprocess.run([sys.executable, cmd], capture_output=True, text=True)
    if res.returncode == 0:
        logger.info(f"Success: {cmd}")
        if res.stdout:
            print(res.stdout.strip())
    else:
        logger.error(f"Error executing {cmd}: {res.stderr}")
        print(res.stderr.strip())

def regenerate_all():
    logger.info("Changes detected! Triggering generation sequence...")
    run_command("scripts/generate_datastore.py")
    run_command("scripts/generate_api_models.py")
    run_command("scripts/generate_documentation.py")
    run_command("scripts/validate_schema.py")

def main():
    logger.info(f"Starting schema watcher. Monitoring files: {', '.join(WATCH_FILES)}")
    
    # Store initial modification times
    mtimes = {}
    for filepath in WATCH_FILES:
        if os.path.exists(filepath):
            mtimes[filepath] = os.path.getmtime(filepath)
        else:
            mtimes[filepath] = 0
            
    # Initial generation
    regenerate_all()
    
    try:
        while True:
            time.sleep(2)
            changed = False
            for filepath in WATCH_FILES:
                if os.path.exists(filepath):
                    current_mtime = os.path.getmtime(filepath)
                    if mtimes.get(filepath) != current_mtime:
                        logger.info(f"File modified: {filepath}")
                        mtimes[filepath] = current_mtime
                        changed = True
            if changed:
                regenerate_all()
    except KeyboardInterrupt:
        logger.info("Schema watcher stopped.")

if __name__ == "__main__":
    main()
