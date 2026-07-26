from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CrimeSubHead:
    """
    Representing Table CrimeSubHead from KCIP Database.
    """
    CrimeSubHeadID: int
    CrimeHeadID: int
    CrimeHeadName: str
    SeqID: Optional[int] = None

    def to_dict(self) -> dict:
        return self.__dict__