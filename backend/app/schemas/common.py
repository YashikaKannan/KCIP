from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class ApiMeta(BaseModel):
    total: int | None = None
    page: int | None = None
    pageSize: int | None = None


class ApiEnvelope(BaseModel):
    success: bool = True
    message: str = "OK"
    data: Any = None
    meta: dict[str, Any] = Field(default_factory=dict)


class LoginRequest(BaseModel):
    email: str
    password: str


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    role: str
    district: str
    designation: str
    phone: str


class CaseBase(BaseModel):
    id: str | None = None
    title: str
    district: str
    category: str
    status: Literal["Open", "Under Investigation", "Closed", "Pending"] = "Open"
    date: str
    officer: str
    station: str | None = None
    time: str | None = None
    description: str | None = None
    victim: str | None = None
    accused: str | None = None
    evidence: str | None = None
    priority: Literal["Low", "Medium", "High", "Critical"] = "Medium"


class CaseCreate(CaseBase):
    pass


class CaseUpdate(BaseModel):
    title: str | None = None
    district: str | None = None
    category: str | None = None
    status: Literal["Open", "Under Investigation", "Closed", "Pending"] | None = None
    date: str | None = None
    officer: str | None = None
    station: str | None = None
    time: str | None = None
    description: str | None = None
    victim: str | None = None
    accused: str | None = None
    evidence: str | None = None
    priority: Literal["Low", "Medium", "High", "Critical"] | None = None


class VictimCreate(BaseModel):
    id: str | None = None
    name: str
    age: int
    gender: str
    district: str
    linkedFIR: str


class AccusedCreate(BaseModel):
    id: str | None = None
    name: str
    age: int
    district: str
    status: str
    repeat: bool = False
    linkedFIR: str | None = None


class NotificationRecord(BaseModel):
    id: str
    title: str
    message: str
    time: str
    priority: str
    read: bool


class AlertRecord(BaseModel):
    id: str
    title: str
    severity: str
    district: str
    message: str
    timestamp: str
