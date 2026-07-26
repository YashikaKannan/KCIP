from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class State:
    """
    Representing Table State from KCIP Database.
    """
    StateID: int
    StateName: str
    NationalityID: Optional[int] = None
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__