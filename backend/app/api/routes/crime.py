from fastapi import APIRouter, HTTPException, status

from ...services.crime import CrimeService
from ...utils.response import api_response

router = APIRouter(tags=["crime"])
service = CrimeService()


@router.get("/crime-heads")
def crime_heads() -> dict:
    return api_response(service.crime_heads())


@router.post("/crime-heads", status_code=status.HTTP_201_CREATED)
def create_crime_head(payload: dict) -> dict:
    return api_response(service.create_crime_head(payload), message="Crime head created")


@router.put("/crime-heads/{head_id}")
def update_crime_head(head_id: str, payload: dict) -> dict:
    crime_head = service.update_crime_head(head_id, payload)
    if crime_head is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crime head not found")
    return api_response(crime_head, message="Crime head updated")


@router.delete("/crime-heads/{head_id}")
def delete_crime_head(head_id: str) -> dict:
    deleted = service.delete_crime_head(head_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crime head not found")
    return api_response({"deleted": True}, message="Crime head deleted")


@router.get("/crime-subheads")
def crime_subheads() -> dict:
    return api_response(service.crime_subheads())


@router.post("/crime-subheads", status_code=status.HTTP_201_CREATED)
def create_crime_subhead(payload: dict) -> dict:
    return api_response(service.create_crime_subhead(payload), message="Crime subhead created")


@router.put("/crime-subheads/{subhead_id}")
def update_crime_subhead(subhead_id: str, payload: dict) -> dict:
    crime_subhead = service.update_crime_subhead(subhead_id, payload)
    if crime_subhead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crime subhead not found")
    return api_response(crime_subhead, message="Crime subhead updated")


@router.delete("/crime-subheads/{subhead_id}")
def delete_crime_subhead(subhead_id: str) -> dict:
    deleted = service.delete_crime_subhead(subhead_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crime subhead not found")
    return api_response({"deleted": True}, message="Crime subhead deleted")


@router.get("/police-stations")
def police_stations() -> dict:
    return api_response(service.police_stations())


@router.post("/police-stations", status_code=status.HTTP_201_CREATED)
def create_police_station(payload: dict) -> dict:
    return api_response(service.create_police_station(payload), message="Police station created")


@router.put("/police-stations/{station_id}")
def update_police_station(station_id: str, payload: dict) -> dict:
    station = service.update_police_station(station_id, payload)
    if station is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Police station not found")
    return api_response(station, message="Police station updated")


@router.delete("/police-stations/{station_id}")
def delete_police_station(station_id: str) -> dict:
    deleted = service.delete_police_station(station_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Police station not found")
    return api_response({"deleted": True}, message="Police station deleted")


@router.get("/districts")
def districts() -> dict:
    return api_response(service.districts())


@router.post("/districts", status_code=status.HTTP_201_CREATED)
def create_district(payload: dict) -> dict:
    district = payload.get("name") or payload.get("district")
    if not district:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="District name is required")
    return api_response(service.create_district(district), message="District created")


@router.put("/districts/{district}")
def update_district(district: str, payload: dict) -> dict:
    new_name = payload.get("name") or payload.get("district")
    if not new_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="District name is required")
    updated = service.update_district(district, new_name)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="District not found")
    return api_response({"district": updated}, message="District updated")


@router.delete("/districts/{district}")
def delete_district(district: str) -> dict:
    deleted = service.delete_district(district)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="District not found")
    return api_response({"deleted": True}, message="District deleted")


@router.get("/courts")
def courts() -> dict:
    return api_response(service.courts())


@router.post("/courts", status_code=status.HTTP_201_CREATED)
def create_court(payload: dict) -> dict:
    court = payload.get("name") or payload.get("court")
    if not court:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Court name is required")
    return api_response(service.create_court(court), message="Court created")


@router.put("/courts/{court}")
def update_court(court: str, payload: dict) -> dict:
    new_name = payload.get("name") or payload.get("court")
    if not new_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Court name is required")
    updated = service.update_court(court, new_name)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")
    return api_response({"court": updated}, message="Court updated")


@router.delete("/courts/{court}")
def delete_court(court: str) -> dict:
    deleted = service.delete_court(court)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Court not found")
    return api_response({"deleted": True}, message="Court deleted")


@router.get("/graph")
def graph() -> dict:
    return api_response(service.graph())
