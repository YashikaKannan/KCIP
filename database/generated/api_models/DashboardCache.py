from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class DashboardCache:
    """
    Representing Table DashboardCache from KCIP Database.
    """
    CacheID: int
    CacheKey: str
    CacheScope: str
    ScopeID: Optional[int] = None
    CacheData: str
    GeneratedAt: str = "CURRENT_TIMESTAMP"
    ExpiresAt: str
    HitCount: int = False
    LastAccessed: Optional[str] = None
    IsValid: bool = True

    def to_dict(self) -> dict:
        return self.__dict__