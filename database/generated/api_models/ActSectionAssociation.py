from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ActSectionAssociation:
    """
    Representing Table ActSectionAssociation from KCIP Database.
    """
    CaseMasterID: int
    ActID: str
    SectionID: str
    ActOrderID: Optional[int] = None
    SectionOrderID: Optional[int] = None

    def to_dict(self) -> dict:
        return self.__dict__