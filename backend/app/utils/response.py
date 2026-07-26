from typing import Any

from ..schemas.common import ApiEnvelope


def api_response(data: Any = None, *, message: str = "OK", success: bool = True, meta: dict[str, Any] | None = None) -> ApiEnvelope:
    return ApiEnvelope(success=success, message=message, data=data, meta=meta or {})


def paginated_response(items: list[Any], *, total: int, page: int = 1, page_size: int | None = None, message: str = "OK") -> ApiEnvelope:
    return api_response(
        items,
        message=message,
        meta={"total": total, "page": page, "pageSize": page_size or len(items)},
    )
