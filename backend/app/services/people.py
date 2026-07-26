from __future__ import annotations

from ..repositories.mock.people import AccusedRepository, EmployeeRepository, VictimRepository


class VictimService:
    def __init__(self, repository: VictimRepository | None = None) -> None:
        self.repository = repository or VictimRepository()

    def list(self) -> list[dict]:
        return self.repository.list()

    def create(self, payload: dict) -> dict:
        return self.repository.create(payload)


class AccusedService:
    def __init__(self, repository: AccusedRepository | None = None) -> None:
        self.repository = repository or AccusedRepository()

    def list(self) -> list[dict]:
        return self.repository.list()

    def create(self, payload: dict) -> dict:
        return self.repository.create(payload)


class EmployeeService:
    def __init__(self, repository: EmployeeRepository | None = None) -> None:
        self.repository = repository or EmployeeRepository()

    def list(self) -> list[dict]:
        return self.repository.list()

    def create(self, payload: dict) -> dict:
        return self.repository.create(payload)

    def update(self, employee_id: str, payload: dict) -> dict | None:
        return self.repository.update(employee_id, payload)

    def delete(self, employee_id: str) -> bool:
        return self.repository.delete(employee_id)
