from __future__ import annotations

from ..repositories.mock.misc import MiscRepository


class MiscService:
    def __init__(self, repository: MiscRepository | None = None) -> None:
        self.repository = repository or MiscRepository()

    def alerts(self) -> list[dict]:
        return self.repository.alerts()

    def notifications(self) -> list[dict]:
        return self.repository.notifications()

    def reports(self) -> list[dict]:
        return self.repository.reports()

    def audit_logs(self) -> list[dict]:
        return self.repository.audit_logs()

    def arrests(self) -> list[dict]:
        return self.repository.arrests()

    def create_arrest(self, payload: dict) -> dict:
        return self.repository.create_arrest(payload)

    def update_arrest(self, arrest_id: str, payload: dict) -> dict | None:
        return self.repository.update_arrest(arrest_id, payload)

    def delete_arrest(self, arrest_id: str) -> bool:
        return self.repository.delete_arrest(arrest_id)

    def chargesheets(self) -> list[dict]:
        return self.repository.chargesheets()

    def create_chargesheet(self, payload: dict) -> dict:
        return self.repository.create_chargesheet(payload)

    def update_chargesheet(self, chargesheet_id: str, payload: dict) -> dict | None:
        return self.repository.update_chargesheet(chargesheet_id, payload)

    def delete_chargesheet(self, chargesheet_id: str) -> bool:
        return self.repository.delete_chargesheet(chargesheet_id)

    def health_services(self) -> list[dict]:
        return self.repository.health_services()
