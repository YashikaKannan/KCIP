from dataclasses import dataclass
from typing import Optional, List, Dict, Any

@dataclass
class AuditLog:
    """
    Representing Table AuditLog from KCIP Database.
    """
    AuditID: int
    TableName: str
    RecordID: str
    OperationType: str
    OldValue: Optional[str] = None
    NewValue: Optional[str] = None
    ChangedBy: Optional[int] = None
    ChangedByKGID: Optional[str] = None
    ChangeTimestamp: str = "CURRENT_TIMESTAMP"
    IPAddress: Optional[str] = None
    UserAgent: Optional[str] = None
    SessionID: Optional[str] = None
    ChangeReason: Optional[str] = None
    IsReversible: bool = True
    ReversedAt: Optional[str] = None
    ReversedBy: Optional[int] = None

    def to_dict(self) -> dict:
        return self.__dict__