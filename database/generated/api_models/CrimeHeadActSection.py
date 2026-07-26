from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimeHeadActSection:
    """
    Representing Table CrimeHeadActSection from KCIP Database.
    """
    CrimeHeadID: int
    ActCode: str
    SectionCode: str

    def to_dict(self) -> dict:
        return self.__dict__