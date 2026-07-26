import json
import os
from pathlib import Path
from typing import Any, Dict, List


ROOT_DIR = Path(__file__).resolve().parents[2]
SCHEMA_PATH = ROOT_DIR / "database" / "generated" / "datastore-schema.json"


def load_dotenv() -> None:
    dotenv_path = ROOT_DIR / ".env"
    if not dotenv_path.exists():
        return
    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_dotenv()


def load_schema(schema_path: str | os.PathLike[str] | None = None) -> Dict[str, Any]:
    path = Path(schema_path or SCHEMA_PATH)
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def ensure_output_dirs(base_dir: Path | None = None) -> Path:
    target = base_dir or ROOT_DIR / "playwright-output"
    target.mkdir(parents=True, exist_ok=True)
    (target / "screenshots").mkdir(parents=True, exist_ok=True)
    (target / "logs").mkdir(parents=True, exist_ok=True)
    return target


def build_column_plan(schema: Dict[str, Any], existing_columns: List[str]) -> List[Dict[str, Any]]:
    plan: List[Dict[str, Any]] = []
    for table in schema.get("tables", []):
        table_name = table.get("name")
        for column in table.get("columns", []):
            column_name = column.get("name")
            full_name = f"{table_name}.{column_name}"
            if full_name in existing_columns:
                continue
            plan.append({"table": table_name, "column": column_name, "definition": column})
    return plan


def compare_schema_with_existing(schema: Dict[str, Any], existing_columns: List[str]) -> Dict[str, List[str]]:
    missing = []
    matched = []
    for table in schema.get("tables", []):
        table_name = table.get("name")
        for column in table.get("columns", []):
            column_name = column.get("name")
            full_name = f"{table_name}.{column_name}"
            if full_name in existing_columns:
                matched.append(full_name)
            else:
                missing.append(full_name)
    return {"missing": missing, "matched": matched}


def format_summary(summary: Dict[str, Any]) -> str:
    lines = [
        "Catalyst Browser Automation Summary",
        f"Timestamp: {summary.get('timestamp')}",
        f"Project: {summary.get('project', '')}",
        f"Tables scanned: {summary.get('tables_scanned')}",
        f"Columns planned: {summary.get('columns_planned')}",
        f"Columns created: {summary.get('columns_created')}",
        f"Columns skipped: {summary.get('columns_skipped')}",
        f"Failures: {summary.get('failures')}",
    ]
    if summary.get("failed_columns"):
        lines.append("Failed columns:")
        for item in summary.get("failed_columns", []):
            lines.append(f"- {item}")
    return "\n".join(lines)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def safe_env(name: str) -> str:
    load_dotenv()
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Environment variable {name} is not set")
    return value


def optional_env(name: str, default: str = "") -> str:
    load_dotenv()
    return os.getenv(name, default).strip()


def get_catalyst_base_url() -> str:
    return optional_env("CATALYST_BASE_URL", "https://console.catalyst.zoho.com")


def get_catalyst_project() -> str:
    return optional_env("CATALYST_PROJECT", "")
