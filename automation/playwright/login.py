from .browser import CatalystBrowser
from .helpers import get_catalyst_project, safe_env
from .selectors import CatalystSelectors


class CatalystLogin:
    def __init__(self, browser: CatalystBrowser) -> None:
        self.browser = browser

    def _dismiss_location_prompt(self) -> None:
        try:
            self.browser.click("text=Remind me later")
        except Exception:
            pass

    def _sign_in_current_page(self) -> None:
        self.browser.wait_for_selector(CatalystSelectors.EMAIL_INPUT)
        self.browser.type_text(CatalystSelectors.EMAIL_INPUT, safe_env("CATALYST_EMAIL"))
        self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
        self.browser.wait_for_selector(CatalystSelectors.PASSWORD_INPUT)
        self.browser.type_text(CatalystSelectors.PASSWORD_INPUT, safe_env("CATALYST_PASSWORD"))
        self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
        self._dismiss_location_prompt()

    def login(self) -> None:
        email = safe_env("CATALYST_EMAIL")
        password = safe_env("CATALYST_PASSWORD")

        self.browser.goto(CatalystSelectors.LOGIN_URL)
        self.browser.wait_for_selector(CatalystSelectors.EMAIL_INPUT)
        self.browser.type_text(CatalystSelectors.EMAIL_INPUT, email)
        self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
        self.browser.wait_for_selector(CatalystSelectors.PASSWORD_INPUT)
        self.browser.type_text(CatalystSelectors.PASSWORD_INPUT, password)
        self.browser.click(CatalystSelectors.SIGN_IN_BUTTON)
        self._dismiss_location_prompt()

    def ensure_console_access(self) -> None:
        self.browser.goto(CatalystSelectors.console_url())
        if self.browser.page is None:
            return
        if self.browser.page.locator(CatalystSelectors.EMAIL_INPUT).count() > 0:
            self._sign_in_current_page()
