from fastapi import APIRouter, HTTPException, status

from ...schemas.common import AccusedCreate, VictimCreate
from ...services.people import AccusedService, EmployeeService, VictimService
from ...utils.response import api_response

router = APIRouter(tags=["people"])
victim_service = VictimService()
accused_service = AccusedService()
employee_service = EmployeeService()


@router.get("/victims")
def list_victims() -> dict:
    return api_response(victim_service.list())


@router.post("/victims", status_code=status.HTTP_201_CREATED)
def create_victim(payload: VictimCreate) -> dict:
    return api_response(victim_service.create(payload.model_dump()), message="Victim created")


@router.get("/accused")
def list_accused() -> dict:
    return api_response(accused_service.list())


@router.post("/accused", status_code=status.HTTP_201_CREATED)
def create_accused(payload: AccusedCreate) -> dict:
    return api_response(accused_service.create(payload.model_dump()), message="Accused created")


@router.get("/employees")
def list_employees() -> dict:
    return api_response(employee_service.list())


@router.post("/employees", status_code=status.HTTP_201_CREATED)
def create_employee(payload: dict) -> dict:
    return api_response(employee_service.create(payload), message="Employee created")


@router.put("/employees/{employee_id}")
def update_employee(employee_id: str, payload: dict) -> dict:
    employee = employee_service.update(employee_id, payload)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return api_response(employee, message="Employee updated")


@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: str) -> dict:
    deleted = employee_service.delete(employee_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return api_response({"deleted": True}, message="Employee deleted")
