from __future__ import annotations

from ..repositories.mock.crime import CrimeRepository


class CrimeService:
    def __init__(self, repository: CrimeRepository | None = None) -> None:
        self.repository = repository or CrimeRepository()

    def districts(self) -> list[str]:
        return self.repository.get_districts()

    def create_district(self, name: str) -> str:
        return self.repository.create_district(name)

    def update_district(self, district: str, new_name: str) -> str | None:
        return self.repository.update_district(district, new_name)

    def delete_district(self, district: str) -> bool:
        return self.repository.delete_district(district)

    def police_stations(self) -> list[dict]:
        return self.repository.get_police_stations()

    def create_police_station(self, payload: dict) -> dict:
        return self.repository.create_police_station(payload)

    def update_police_station(self, station_id: str, payload: dict) -> dict | None:
        return self.repository.update_police_station(station_id, payload)

    def delete_police_station(self, station_id: str) -> bool:
        return self.repository.delete_police_station(station_id)

    def courts(self) -> list[str]:
        return self.repository.get_courts()

    def create_court(self, name: str) -> str:
        return self.repository.create_court(name)

    def update_court(self, court: str, new_name: str) -> str | None:
        return self.repository.update_court(court, new_name)

    def delete_court(self, court: str) -> bool:
        return self.repository.delete_court(court)

    def crime_heads(self) -> list[dict]:
        return self.repository.get_crime_heads()

    def create_crime_head(self, payload: dict) -> dict:
        return self.repository.create_crime_head(payload)

    def update_crime_head(self, head_id: str, payload: dict) -> dict | None:
        return self.repository.update_crime_head(head_id, payload)

    def delete_crime_head(self, head_id: str) -> bool:
        return self.repository.delete_crime_head(head_id)

    def crime_subheads(self) -> list[dict]:
        return self.repository.get_crime_subheads()

    def create_crime_subhead(self, payload: dict) -> dict:
        return self.repository.create_crime_subhead(payload)

    def update_crime_subhead(self, subhead_id: str, payload: dict) -> dict | None:
        return self.repository.update_crime_subhead(subhead_id, payload)

    def delete_crime_subhead(self, subhead_id: str) -> bool:
        return self.repository.delete_crime_subhead(subhead_id)

    def graph(self) -> dict:
        return self.repository.get_graph()
