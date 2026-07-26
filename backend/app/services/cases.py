from __future__ import annotations

from ..repositories.mock.cases import CaseRepository


class CaseService:
    def __init__(self, repository: CaseRepository | None = None) -> None:
        self.repository = repository or CaseRepository()

    def list(self) -> list[dict]:
        return self.repository.list()

    def get(self, case_id: str) -> dict | None:
        return self.repository.get(case_id)

    def create(self, payload: dict) -> dict:
        return self.repository.create(payload)

    def update(self, case_id: str, payload: dict) -> dict | None:
        return self.repository.update(case_id, payload)

    def delete(self, case_id: str) -> bool:
        return self.repository.delete(case_id)
