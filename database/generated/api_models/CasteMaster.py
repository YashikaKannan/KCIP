from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class CasteMaster:
    """
    Representing Table CasteMaster from KCIP Database.
    """
    caste_master_id: int
    caste_master_name: str

    def to_dict(self) -> dict:
        return self.__dict__