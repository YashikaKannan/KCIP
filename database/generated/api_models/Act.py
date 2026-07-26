from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Act:
    """
    Representing Table Act from KCIP Database.
    """
    ActCode: str
    ActDescription: Optional[str] = None
    ShortName: Optional[str] = None
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__