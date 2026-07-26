from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimeAssociation:
    """
    Representing Table CrimeAssociation from KCIP Database.
    """
    AssociationID: int
    SourceCaseMasterID: int
    TargetCaseMasterID: int
    AssociationType: str
    AssociationStrength: Optional[float] = None
    AssociationNotes: Optional[str] = None
    DetectedBy: str = "SYSTEM"
    CreatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__