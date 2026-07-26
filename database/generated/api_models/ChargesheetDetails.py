from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ChargesheetDetails:
    """
    Representing Table ChargesheetDetails from KCIP Database.
    """
    CSID: int
    CaseMasterID: int
    csdate: str
    cstype: str
    PolicePersonID: int
    CreatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__