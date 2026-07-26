from .helpers import get_catalyst_base_url


class CatalystSelectors:
    LOGIN_URL = "https://accounts.zoho.com/signin"
    EMAIL_INPUT = "#login_id"
    PASSWORD_INPUT = "#password"
    SIGN_IN_BUTTON = "#nextbtn"
    CATALYST_LAUNCHER = "text=Catalyst"
    PROJECT_CARD = "text=KCIP"
    CLOUD_SCALE_LINK = "a[href='#/cloudscale/datastore/tables']"
    DATA_STORE_LINK = "text=Data Store"
    TABLE_LIST = "[data-testid='table-list']"
    TABLE_ITEM = "[data-testid='table-item']"
    NEW_COLUMN_BUTTON = "button:has-text('Add Column')"
    COLUMN_NAME_INPUT = "input[name='columnName']"
    COLUMN_TYPE_SELECT = "select[name='columnType']"
    COLUMN_REQUIRED_TOGGLE = "input[name='isMandatory']"
    SAVE_COLUMN_BUTTON = "button:has-text('Save')"
    COLUMN_EXISTS_ALERT = "text=already exists"
    SUCCESS_TOAST = "text=success"

    @classmethod
    def console_url(cls) -> str:
        return get_catalyst_base_url()
