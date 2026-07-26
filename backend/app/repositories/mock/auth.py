from __future__ import annotations

from .base import MockRepositoryBase


class AuthRepository(MockRepositoryBase):
    def login(self, email: str, password: str) -> dict | None:
        return self.store.login(email, password)

    def current_user(self) -> dict:
        return self.store.get_current_user()
