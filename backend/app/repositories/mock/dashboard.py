from __future__ import annotations

from .base import MockRepositoryBase


class DashboardRepository(MockRepositoryBase):
    def get_summary(self) -> dict:
        return self.store.get_dashboard_summary()

    def get_hotspots(self) -> list[dict]:
        return self.store.get_hotspots()

    def get_recent_cases(self, limit: int = 8) -> list[dict]:
        return self.store.get_recent_cases(limit)

    def get_health_services(self) -> list[dict]:
        return self.store.list_health_services()

    def get_bootstrap(self) -> dict:
        return self.store.get_bootstrap()
