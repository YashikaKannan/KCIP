# Catalyst Browser Automation

This automation framework is designed to deploy missing Catalyst Data Store columns by comparing the generated schema in [database/generated/datastore-schema.json](../database/generated/datastore-schema.json) with the current Catalyst console state.

## Setup

1. Copy [.env.example](../.env.example) to .env and fill in your Catalyst credentials.
2. Install the Python dependencies:
   - `pip install playwright`
   - `python -m playwright install chromium`
3. Run:
   - `python automation/run_catalyst_deployment.py`

## Notes

- The automation is modular and keeps selectors in [automation/playwright/selectors.py](playwright/selectors.py).
- Screenshots and logs are written under [automation/playwright-output](playwright-output).
- Existing tables are never recreated and existing columns are skipped by design.
- Failed column creation attempts are retried and logged.
