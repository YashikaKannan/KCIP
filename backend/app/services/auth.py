from __future__ import annotations

from ..core.settings import get_settings
from ..repositories.mock.auth import AuthRepository
from ..utils.security import create_jwt


class AuthService:
    def __init__(self, repository: AuthRepository | None = None) -> None:
        self.repository = repository or AuthRepository()
        self.settings = get_settings()

    def login(self, email: str, password: str) -> dict:
        user = self.repository.login(email, password)
        if not user:
            raise ValueError("Invalid credentials")
        token = create_jwt(
            {"sub": user["id"], "email": user["email"], "role": user["role"]},
            self.settings.jwt_secret,
            issuer=self.settings.jwt_issuer,
            audience=self.settings.jwt_audience,
            expires_minutes=self.settings.access_token_minutes,
        )
        return {"token": token, "user": self._public_user(user)}

    def current_user(self) -> dict:
        return self._public_user(self.repository.current_user())

    def logout(self) -> dict:
        return {"loggedOut": True}

    def _public_user(self, user: dict) -> dict:
        return {k: user[k] for k in ["id", "name", "email", "role", "district", "designation", "phone"]}
