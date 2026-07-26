from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from .browser import CatalystBrowser
from .helpers import build_column_plan, compare_schema_with_existing, ensure_output_dirs, format_summary, get_catalyst_project, load_schema, safe_env, write_text
from .selectors import CatalystSelectors


class ColumnDeployment:
    def __init__(self, browser: CatalystBrowser) -> None:
        self.browser = browser
        self.output_dir = ensure_output_dirs()

    def discover_existing_columns(self) -> List[str]:
        state_path = self.output_dir / "deployment_state.json"
        if state_path.exists():
            try:
                import json

                with state_path.open("r", encoding="utf-8") as handle:
                    data = json.load(handle)
                return data.get("existing_columns", [])
            except Exception:
                pass

        return []

    def deploy(self) -> Dict[str, Any]:
        summary: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "tables_scanned": 0,
            "columns_planned": 0,
            "columns_created": 0,
            "columns_skipped": 0,
            "failures": 0,
            "failed_columns": [],
        }

        schema = load_schema()
        summary["tables_scanned"] = len(schema.get("tables", []))
        project_name = get_catalyst_project()
        if project_name:
            summary["project"] = project_name

        existing_columns = self.discover_existing_columns()
        comparison = compare_schema_with_existing(schema, existing_columns)
        plan = build_column_plan(schema, existing_columns)
        summary["columns_planned"] = len(plan)
        summary["columns_skipped"] = len(comparison["matched"])

        self.browser.goto(CatalystSelectors.console_url())
        try:
            self.browser.wait_for_selector(CatalystSelectors.EMAIL_INPUT, timeout=15000)
            self.browser.type_text(CatalystSelectors.EMAIL_INPUT, safe_env("CATALYST_EMAIL"))
            self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
            self.browser.wait_for_selector(CatalystSelectors.PASSWORD_INPUT, timeout=30000)
            self.browser.type_text(CatalystSelectors.PASSWORD_INPUT, safe_env("CATALYST_PASSWORD"))
            self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
            try:
                self.browser.click("text=Remind me later")
            except Exception:
                pass
        except Exception:
            pass

        try:
            self.browser.wait_for_selector("text=Create and Access Projects", timeout=30000)
        except Exception:
            pass

        if self.browser.page and self.browser.page.locator("text=Access Project").count() > 0:
            self.browser.click(CatalystSelectors.PROJECT_CARD)
            self.browser.wait_for_url("**/project/**/Development*", timeout=30000)

        if self.browser.page:
            project_base_url = self.browser.page.url.split("#")[0]
            self.browser.goto(f"{project_base_url}#/cloudscale/datastore/tables")

        for selector in ("text=Tables List", "text=New Table", CatalystSelectors.DATA_STORE_LINK):
            try:
                self.browser.wait_for_selector(selector, timeout=10000)
                break
            except Exception:
                continue

        for item in plan:
            table_name = item["table"]
            column_name = item["column"]
            definition = item["definition"]
            full_name = f"{table_name}.{column_name}"
            for attempt in range(3):
                try:
                    self.browser.click(CatalystSelectors.TABLE_ITEM)
                    self.browser.click(CatalystSelectors.NEW_COLUMN_BUTTON)
                    self.browser.type_text(CatalystSelectors.COLUMN_NAME_INPUT, column_name)
                    self.browser.type_text(CatalystSelectors.COLUMN_TYPE_SELECT, definition.get("type", "VarChar"))
                    self.browser.click(CatalystSelectors.SAVE_COLUMN_BUTTON)
                    summary["columns_created"] += 1
                    break
                except Exception:
                    if attempt == 2:
                        summary["failures"] += 1
                        summary["failed_columns"].append(full_name)
                        self.browser.screenshot(f"failure_{table_name}_{column_name}")
                    else:
                        self.browser.screenshot(f"retry_{table_name}_{column_name}_{attempt + 1}")

        summary["columns_skipped"] = len(existing_columns)

        report_path = self.output_dir / "logs" / "deployment-summary.txt"
        write_text(report_path, format_summary(summary))
        return summary
