from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class Employee:
    """
    Representing Table Employee from KCIP Database.
    """
    EmployeeID: int
    DistrictID: int
    UnitID: int
    RankID: int
    DesignationID: int
    KGID: str
    FirstName: str
    EmployeeDOB: Optional[str] = None
    GenderID: Optional[int] = None
    BloodGroupID: Optional[int] = None
    PhysicallyChallenged: bool = False
    AppointmentDate: Optional[str] = None

    def to_dict(self) -> dict:
        return self.__dict__