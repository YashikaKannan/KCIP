from __future__ import annotations

from typing import TypedDict


class Case(TypedDict, total=False):
    id: str
    title: str
    district: str
    category: str
    status: str
    date: str
    officer: str
    station: str
    time: str
    description: str
    victim: str
    accused: str
    evidence: str
    priority: str


class Victim(TypedDict, total=False):
    id: str
    name: str
    age: int
    gender: str
    district: str
    linkedFIR: str


class Accused(TypedDict, total=False):
    id: str
    name: str
    age: int
    district: str
    status: str
    repeat: bool
    linkedFIR: str
