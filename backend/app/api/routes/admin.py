from fastapi import APIRouter, HTTPException, status

from ...services.misc import MiscService
from ...utils.response import api_response

router = APIRouter(tags=["admin"])
service = MiscService()


@router.get("/notifications")
def notifications() -> dict:
    return api_response(service.notifications())


@router.get("/reports")
def reports() -> dict:
    return api_response(service.reports())


@router.get("/arrests")
def arrests() -> dict:
    return api_response(service.arrests())


@router.post("/arrests", status_code=status.HTTP_201_CREATED)
def create_arrest(payload: dict) -> dict:
    return api_response(service.create_arrest(payload), message="Arrest created")


@router.put("/arrests/{arrest_id}")
def update_arrest(arrest_id: str, payload: dict) -> dict:
    arrest = service.update_arrest(arrest_id, payload)
    if arrest is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arrest not found")
    return api_response(arrest, message="Arrest updated")


@router.delete("/arrests/{arrest_id}")
def delete_arrest(arrest_id: str) -> dict:
    deleted = service.delete_arrest(arrest_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arrest not found")
    return api_response({"deleted": True}, message="Arrest deleted")


@router.get("/charge-sheets")
def charge_sheets() -> dict:
    return api_response(service.chargesheets())


@router.post("/charge-sheets", status_code=status.HTTP_201_CREATED)
def create_charge_sheet(payload: dict) -> dict:
    return api_response(service.create_chargesheet(payload), message="Charge sheet created")


@router.put("/charge-sheets/{charge_sheet_id}")
def update_charge_sheet(charge_sheet_id: str, payload: dict) -> dict:
    charge_sheet = service.update_chargesheet(charge_sheet_id, payload)
    if charge_sheet is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Charge sheet not found")
    return api_response(charge_sheet, message="Charge sheet updated")


@router.delete("/charge-sheets/{charge_sheet_id}")
def delete_charge_sheet(charge_sheet_id: str) -> dict:
    deleted = service.delete_chargesheet(charge_sheet_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Charge sheet not found")
    return api_response({"deleted": True}, message="Charge sheet deleted")


@router.get("/audit-logs")
def audit_logs() -> dict:
    return api_response(service.audit_logs())


@router.get("/health-services")
def health_services() -> dict:
    return api_response(service.health_services())
