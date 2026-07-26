from __future__ import annotations

from copy import deepcopy

from .base import MockRepositoryBase


class CrimeRepository(MockRepositoryBase):
    def get_districts(self) -> list[str]:
        return self.store.list_districts()

    def create_district(self, name: str) -> str:
        self.store.districts.append(name)
        return name

    def update_district(self, district: str, new_name: str) -> str | None:
        if district not in self.store.districts:
            return None
        index = self.store.districts.index(district)
        self.store.districts[index] = new_name
        return new_name

    def delete_district(self, district: str) -> bool:
        before = len(self.store.districts)
        self.store.districts = [item for item in self.store.districts if item != district]
        return len(self.store.districts) != before

    def get_police_stations(self) -> list[dict]:
        return self.store.list_police_stations()

    def create_police_station(self, payload: dict) -> dict:
        station = {
            "id": payload.get("id") or f"PS-{1000 + len(self.store.police_stations) + 1}",
            "name": payload.get("name") or "New PS",
            "district": payload.get("district") or self.store.districts[0],
        }
        self.store.police_stations.insert(0, station)
        return deepcopy(station)

    def update_police_station(self, station_id: str, payload: dict) -> dict | None:
        for index, station in enumerate(self.store.police_stations):
            if station["id"] == station_id:
                self.store.police_stations[index] = {**station, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.police_stations[index])
        return None

    def delete_police_station(self, station_id: str) -> bool:
        before = len(self.store.police_stations)
        self.store.police_stations = [station for station in self.store.police_stations if station["id"] != station_id]
        return len(self.store.police_stations) != before

    def get_courts(self) -> list[str]:
        return self.store.list_courts()

    def create_court(self, name: str) -> str:
        self.store.courts.append(name)
        return name

    def update_court(self, court: str, new_name: str) -> str | None:
        if court not in self.store.courts:
            return None
        index = self.store.courts.index(court)
        self.store.courts[index] = new_name
        return new_name

    def delete_court(self, court: str) -> bool:
        before = len(self.store.courts)
        self.store.courts = [item for item in self.store.courts if item != court]
        return len(self.store.courts) != before

    def get_crime_heads(self) -> list[dict]:
        return self.store.list_crime_heads()

    def create_crime_head(self, payload: dict) -> dict:
        head = {
            "id": payload.get("id") or f"H{len(self.store.crime_heads) + 1:02d}",
            "name": payload.get("name") or "New Crime Head",
        }
        self.store.crime_heads.insert(0, head)
        return deepcopy(head)

    def update_crime_head(self, head_id: str, payload: dict) -> dict | None:
        for index, head in enumerate(self.store.crime_heads):
            if head["id"] == head_id:
                self.store.crime_heads[index] = {**head, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.crime_heads[index])
        return None

    def delete_crime_head(self, head_id: str) -> bool:
        before = len(self.store.crime_heads)
        self.store.crime_heads = [head for head in self.store.crime_heads if head["id"] != head_id]
        return len(self.store.crime_heads) != before

    def get_crime_subheads(self) -> list[dict]:
        return self.store.list_crime_subheads()

    def create_crime_subhead(self, payload: dict) -> dict:
        subhead = {
            "id": payload.get("id") or f"S{len(self.store.crime_subheads) + 1:02d}",
            "headId": payload.get("headId") or self.store.crime_heads[0]["id"],
            "name": payload.get("name") or "New Crime Subhead",
        }
        self.store.crime_subheads.insert(0, subhead)
        return deepcopy(subhead)

    def update_crime_subhead(self, subhead_id: str, payload: dict) -> dict | None:
        for index, subhead in enumerate(self.store.crime_subheads):
            if subhead["id"] == subhead_id:
                self.store.crime_subheads[index] = {**subhead, **{key: value for key, value in payload.items() if value is not None}}
                return deepcopy(self.store.crime_subheads[index])
        return None

    def delete_crime_subhead(self, subhead_id: str) -> bool:
        before = len(self.store.crime_subheads)
        self.store.crime_subheads = [subhead for subhead in self.store.crime_subheads if subhead["id"] != subhead_id]
        return len(self.store.crime_subheads) != before

    def get_graph(self) -> dict:
        return self.store.get_graph()
