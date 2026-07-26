import os

# Configuration paths for the Catalyst Deployment Assistant
SCHEMA_PATH = "database/generated/datastore-schema.json"
STATE_FILE = "deployment/state.json"
LOG_DIR = "logs"
DEPLOY_DIR = "deployment"

# Ensure crucial directories exist
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(DEPLOY_DIR, exist_ok=True)
