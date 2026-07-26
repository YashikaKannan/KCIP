from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class inv_arrestsurrenderaccused:
    """
    Representing Table inv_arrestsurrenderaccused from KCIP Database.
    """
    ArrestSurrenderID: int
    AccusedMasterID: int

    def to_dict(self) -> dict:
        return self.__dict__