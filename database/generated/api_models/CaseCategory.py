from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CaseCategory:
    """
    Representing Table CaseCategory from KCIP Database.
    """
    CaseCategoryID: int
    LookupValue: str

    def to_dict(self) -> dict:
        return self.__dict__