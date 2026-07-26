from __future__ import annotations

from ...mock.store import DATA_STORE


class MockRepositoryBase:
    def __init__(self) -> None:
        self.store = DATA_STORE
