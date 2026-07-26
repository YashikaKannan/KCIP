from fastapi import APIRouter, HTTPException, status

from ...schemas.common import CaseCreate, CaseUpdate
from ...services.cases import CaseService
from ...utils.response import api_response

router = APIRouter(prefix="/cases", tags=["cases"])
service = CaseService()


@router.get("")
def list_cases() -> dict:
    return api_response(service.list())


@router.get("/{case_id}")
def get_case(case_id: str) -> dict:
    case = service.get(case_id)
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return api_response(case)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_case(payload: CaseCreate) -> dict:
    return api_response(service.create(payload.model_dump()), message="Case created")


@router.put("/{case_id}")
def update_case(case_id: str, payload: CaseUpdate) -> dict:
    case = service.update(case_id, payload.model_dump(exclude_none=True))
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return api_response(case, message="Case updated")


@router.delete("/{case_id}")
def delete_case(case_id: str) -> dict:
    if not service.delete(case_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return api_response({"deleted": True}, message="Case deleted")
