from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Section:
    """
    Representing Table Section from KCIP Database.
    """
    ActCode: str
    SectionCode: str
    SectionDescription: Optional[str] = None
    Active: bool = True

    def to_dict(self) -> dict:
        return self.__dict__