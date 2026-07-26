from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimePrediction:
    """
    Representing Table CrimePrediction from KCIP Database.
    """
    PredictionID: int
    CaseMasterID: Optional[int] = None
    DistrictID: int
    UnitID: int
    CrimeHeadID: Optional[int] = None
    PredictionDate: str
    PredictionType: str
    RiskLevel: str
    ConfidenceScore: Optional[float] = None
    PredictionWindow: Optional[int] = None
    ModelVersion: Optional[str] = None
    ModelParameters: Optional[str] = None
    PredictionStatus: str = "PENDING"
    ValidationNotes: Optional[str] = None
    ValidatedBy: Optional[int] = None
    ValidatedAt: Optional[str] = None
    CreatedAt: str = "CURRENT_TIMESTAMP"
    UpdatedAt: str = "CURRENT_TIMESTAMP"

    def to_dict(self) -> dict:
        return self.__dict__