from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Rank:
    """
    Representing Table Rank from KCIP Database.
    """
    RankID: int
    RankName: str
    Hierarchy: Optional[int] = None
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__