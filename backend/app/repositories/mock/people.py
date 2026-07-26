from __future__ import annotations

from copy import deepcopy

from .base import MockRepositoryBase


class VictimRepository(MockRepositoryBase):
    def list(self) -> list[dict]:
        return self.store.list_victims()

    def create(self, payload: dict) -> dict:
        return self.store.create_victim(payload)


class AccusedRepository(MockRepositoryBase):
    def list(self) -> list[dict]:
        return self.store.list_accused()

    def create(self, payload: dict) -> dict:
        return self.store.create_accused(payload)


class EmployeeRepository(MockRepositoryBase):
    def list(self) -> list[dict]:
        return self.store.list_employees()

    def create(self, payload: dict) -> dict:
        employee = {
            "id": payload.get("id") or f"EMP-{200 + len(self.store.employees) + 1}",
            "name": payload.get("name") or "New Employee",
            "district": payload.get("district") or self.store.districts[0],
            "station": payload.get("station") or self.store.police_stations[0]["name"],
            "rank": payload.get("rank") or "Inspector",
            "designation": payload.get("designation") or "Investigating Officer",
            "status": payload.get("status") or "Active",
        }
        self.store.employees.insert(0, employee)
        return deepcopy(employee)

    def update(self, employee_id: str, payload: dict) -> dict | None:
        for index, employee in enumerate(self.store.employees):
            if employee["id"] == employee_id:
                self.store.employees[index] = {**employee, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.employees[index])
        return None

    def delete(self, employee_id: str) -> bool:
        before = len(self.store.employees)
        self.store.employees = [employee for employee in self.store.employees if employee["id"] != employee_id]
        return len(self.store.employees) != before
