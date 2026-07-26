import { fetchJson, type ApiResponse } from "./api";
import type { EmployeeRecord } from "./kcip";

export const getEmployees = () => fetchJson<ApiResponse<EmployeeRecord[]>>("/employees");
