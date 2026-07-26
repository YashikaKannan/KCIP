from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class ComplainantDetails:
    """
    Representing Table ComplainantDetails from KCIP Database.
    """
    ComplainantID: int
    CaseMasterID: int
    ComplainantName: str
    AgeYear: Optional[int] = None
    OccupationID: Optional[int] = None
    ReligionID: Optional[int] = None
    CasteID: Optional[int] = None
    GenderID: Optional[int] = None

    def to_dict(self) -> dict:
        return self.__dict__