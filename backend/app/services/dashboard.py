from __future__ import annotations

from ..repositories.mock.dashboard import DashboardRepository


class DashboardService:
    def __init__(self, repository: DashboardRepository | None = None) -> None:
        self.repository = repository or DashboardRepository()

    def summary(self) -> dict:
        return self.repository.get_summary()

    def hotspots(self) -> list[dict]:
        return self.repository.get_hotspots()

    def recent_cases(self, limit: int = 8) -> list[dict]:
        return self.repository.get_recent_cases(limit)

    def health_services(self) -> list[dict]:
        return self.repository.get_health_services()

    def bootstrap(self) -> dict:
        return self.repository.get_bootstrap()

    def dashboard(self) -> dict:
        return {
            "summary": self.repository.get_summary(),
            "hotspots": self.repository.get_hotspots(),
            "recentCases": self.repository.get_recent_cases(8),
            "healthServices": self.repository.get_health_services(),
            "bootstrap": self.repository.get_bootstrap(),
        }
