from __future__ import annotations

from copy import deepcopy

from .base import MockRepositoryBase


class MiscRepository(MockRepositoryBase):
    def alerts(self) -> list[dict]:
        return self.store.list_alerts()

    def notifications(self) -> list[dict]:
        return self.store.list_notifications()

    def reports(self) -> list[dict]:
        return self.store.list_reports()

    def audit_logs(self) -> list[dict]:
        return self.store.list_audit_logs()

    def arrests(self) -> list[dict]:
        return self.store.list_arrests()

    def create_arrest(self, payload: dict) -> dict:
        arrest = {
            "id": payload.get("id") or f"ARR-{3000 + len(self.store.arrests) + 1}",
            "accused": payload.get("accused") or "New Accused",
            "fir": payload.get("fir") or self.store.cases[0]["id"],
            "date": payload.get("date") or self.store.cases[0]["date"],
            "officer": payload.get("officer") or "Insp. R. Kumar",
            "district": payload.get("district") or self.store.districts[0],
        }
        self.store.arrests.insert(0, arrest)
        return deepcopy(arrest)

    def update_arrest(self, arrest_id: str, payload: dict) -> dict | None:
        for index, arrest in enumerate(self.store.arrests):
            if arrest["id"] == arrest_id:
                self.store.arrests[index] = {**arrest, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.arrests[index])
        return None

    def delete_arrest(self, arrest_id: str) -> bool:
        before = len(self.store.arrests)
        self.store.arrests = [arrest for arrest in self.store.arrests if arrest["id"] != arrest_id]
        return len(self.store.arrests) != before

    def chargesheets(self) -> list[dict]:
        return self.store.list_chargesheets()

    def create_chargesheet(self, payload: dict) -> dict:
        chargesheet = {
            "id": payload.get("id") or f"CS-{4000 + len(self.store.chargesheets) + 1}",
            "fir": payload.get("fir") or self.store.cases[0]["id"],
            "filedOn": payload.get("filedOn") or self.store.cases[0]["date"],
            "court": payload.get("court") or self.store.courts[0],
            "status": payload.get("status") or "Filed",
        }
        self.store.chargesheets.insert(0, chargesheet)
        return deepcopy(chargesheet)

    def update_chargesheet(self, chargesheet_id: str, payload: dict) -> dict | None:
        for index, chargesheet in enumerate(self.store.chargesheets):
            if chargesheet["id"] == chargesheet_id:
                self.store.chargesheets[index] = {**chargesheet, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.chargesheets[index])
        return None

    def delete_chargesheet(self, chargesheet_id: str) -> bool:
        before = len(self.store.chargesheets)
        self.store.chargesheets = [chargesheet for chargesheet in self.store.chargesheets if chargesheet["id"] != chargesheet_id]
        return len(self.store.chargesheets) != before

    def health_services(self) -> list[dict]:
        return self.store.list_health_services()
