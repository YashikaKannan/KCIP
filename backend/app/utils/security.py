import base64
import hashlib
import hmac
import json
import time
from typing import Any


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("utf-8")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode((value + padding).encode("utf-8"))


def create_jwt(payload: dict[str, Any], secret: str, *, issuer: str, audience: str, expires_minutes: int) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    claims = {
        **payload,
        "iss": issuer,
        "aud": audience,
        "iat": now,
        "exp": now + expires_minutes * 60,
    }
    header_part = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_part = _b64url_encode(json.dumps(claims, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_part}.{payload_part}".encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_part}.{payload_part}.{_b64url_encode(signature)}"


def decode_jwt(token: str, secret: str, *, issuer: str, audience: str) -> dict[str, Any]:
    header_part, payload_part, signature_part = token.split(".")
    signing_input = f"{header_part}.{payload_part}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    if not hmac.compare_digest(expected, _b64url_decode(signature_part)):
        raise ValueError("Invalid token signature")
    claims = json.loads(_b64url_decode(payload_part))
    if claims.get("iss") != issuer or claims.get("aud") != audience:
        raise ValueError("Invalid token audience")
    if int(time.time()) >= int(claims.get("exp", 0)):
        raise ValueError("Token expired")
    return claims
