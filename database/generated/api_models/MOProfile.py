from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class MOProfile:
    """
    Representing Table MOProfile from KCIP Database.
    """
    MOProfileID: int
    AccusedMasterID: int
    CrimeHeadID: Optional[int] = None
    PreferredTimeOfDay: Optional[str] = None
    PreferredDayOfWeek: Optional[str] = None
    TypicalMethod: Optional[str] = None
    TypicalLocation: Optional[str] = None
    ToolsUsed: Optional[str] = None
    TargetProfile: Optional[str] = None
    GeographicRange: Optional[float] = None
    AverageIncidentDurationMins: Optional[int] = None
    PatternConfidence: Optional[float] = None
    LinkedCaseCount: int = False
    CreatedAt: str = "CURRENT_TIMESTAMP"
    UpdatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__