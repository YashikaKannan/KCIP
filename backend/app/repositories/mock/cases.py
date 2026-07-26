from __future__ import annotations

from .base import MockRepositoryBase


class CaseRepository(MockRepositoryBase):
    def list(self) -> list[dict]:
        return self.store.list_cases()

    def get(self, case_id: str) -> dict | None:
        return self.store.get_case(case_id)

    def create(self, payload: dict) -> dict:
        return self.store.create_case(payload)

    def update(self, case_id: str, payload: dict) -> dict | None:
        return self.store.update_case(case_id, payload)

    def delete(self, case_id: str) -> bool:
        return self.store.delete_case(case_id)
