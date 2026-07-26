from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CaseStatusMaster:
    """
    Representing Table CaseStatusMaster from KCIP Database.
    """
    CaseStatusID: int
    CaseStatusName: str

    def to_dict(self) -> dict:
        return self.__dict__