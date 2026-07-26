from __future__ import annotations

from ..repositories.mock.ai import AIRepository


class AIService:
    def __init__(self, repository: AIRepository | None = None) -> None:
        self.repository = repository or AIRepository()

    def alerts(self) -> list[dict]:
        return self.repository.get_alerts()

    def predictions(self) -> dict:
        return self.repository.get_predictions()

    def insights(self) -> list[dict]:
        return self.repository.get_insights()

    def associations(self) -> dict:
        return self.repository.get_associations()

    def repeat_offenders(self) -> list[dict]:
        return self.repository.get_repeat_offenders()

    def mo_profiles(self) -> list[dict]:
        return self.repository.get_mo_profiles()

    def dashboard_cache(self) -> dict:
        return self.repository.get_dashboard_cache()
