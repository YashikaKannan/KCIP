from typing import Optional

from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright

from .helpers import ensure_output_dirs


class CatalystBrowser:
    def __init__(self, headless: bool = True) -> None:
        self.headless = headless
        self.output_dir = ensure_output_dirs()
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None

    def launch(self) -> None:
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=self.headless)
        self.context = self.browser.new_context(record_video_dir=str(self.output_dir / "videos"))
        self.page = self.context.new_page()

    def close(self) -> None:
        if self.context:
            self.context.close()
        if self.browser:
            self.browser.close()
        if getattr(self, "playwright", None):
            self.playwright.stop()

    def screenshot(self, name: str) -> None:
        if not self.page:
            return
        path = self.output_dir / "screenshots" / f"{name}.png"
        self.page.screenshot(path=str(path), full_page=True)

    def goto(self, url: str) -> None:
        if self.page is None:
            raise RuntimeError("Browser page not initialized")
        self.page.goto(url, wait_until="domcontentloaded")

    def wait_for_selector(self, selector: str, timeout: int = 15000) -> None:
        if self.page is None:
            raise RuntimeError("Browser page not initialized")
        self.page.wait_for_selector(selector, timeout=timeout)

    def wait_for_url(self, url_pattern: str, timeout: int = 15000) -> None:
        if self.page is None:
            raise RuntimeError("Browser page not initialized")
        self.page.wait_for_url(url_pattern, timeout=timeout)

    def click(self, selector: str) -> None:
        if self.page is None:
            raise RuntimeError("Browser page not initialized")
        self.page.locator(selector).first.click()

    def type_text(self, selector: str, value: str) -> None:
        if self.page is None:
            raise RuntimeError("Browser page not initialized")
        self.page.locator(selector).first.fill(value)
