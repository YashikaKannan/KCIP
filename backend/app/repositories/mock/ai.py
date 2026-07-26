from __future__ import annotations

from .base import MockRepositoryBase


class AIRepository(MockRepositoryBase):
    def get_alerts(self) -> list[dict]:
        return self.store.list_alerts()

    def get_predictions(self) -> dict:
        return self.store.get_predictions()

    def get_insights(self) -> list[dict]:
        return self.store.list_ai_insights()

    def get_associations(self) -> dict:
        return self.store.get_graph()

    def get_repeat_offenders(self) -> list[dict]:
        return [
            {
                **accused,
                "linkedCases": [case["id"] for case in self.store.cases if case["id"] == accused.get("linkedFIR")],
                "riskScore": 70 + index * 3,
            }
            for index, accused in enumerate(self.store.list_accused())
            if accused.get("repeat")
        ]

    def get_mo_profiles(self) -> list[dict]:
        return [
            {
                "id": accused["id"],
                "name": accused["name"],
                "pattern": "Repeat property crime" if accused.get("repeat") else "Single-incident",
                "riskScore": 60 + index * 2,
                "linkedFIR": accused.get("linkedFIR"),
            }
            for index, accused in enumerate(self.store.list_accused())
            if accused.get("repeat") or index % 4 == 0
        ]

    def get_dashboard_cache(self) -> dict:
        return {
            "summary": self.store.get_dashboard_summary(),
            "hotspots": self.store.get_hotspots(),
            "recentCases": self.store.get_recent_cases(8),
            "healthServices": self.store.list_health_services(),
        }
