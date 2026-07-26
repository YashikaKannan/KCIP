import site
import sys
import sysconfig
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
script_dir = str(Path(__file__).resolve().parent)
site_packages = [p for p in site.getsitepackages() if p and Path(p).exists()]
site_packages.append(sysconfig.get_paths().get("purelib", ""))
site_packages = [p for p in site_packages if p]
for entry in [script_dir, str(ROOT), *site_packages]:
    if entry in sys.path:
        sys.path.remove(entry)
sys.path.insert(0, str(ROOT))
for entry in site_packages:
    if entry not in sys.path:
        sys.path.insert(0, entry)

from automation.playwright.browser import CatalystBrowser
from automation.playwright.create_columns import ColumnDeployment
from automation.playwright.helpers import write_text
from automation.playwright.login import CatalystLogin


def main() -> None:
    browser = CatalystBrowser(headless=True)
    try:
        browser.launch()
        login = CatalystLogin(browser)
        login.login()
        deployment = ColumnDeployment(browser)
        summary = deployment.deploy()
        print(summary)
    except Exception as exc:
        error_path = ROOT / "playwright-output" / "logs" / "deployment-error.txt"
        write_text(error_path, str(exc))
        print(f"Deployment failed: {exc}")
    finally:
        browser.close()


if __name__ == "__main__":
    main()
