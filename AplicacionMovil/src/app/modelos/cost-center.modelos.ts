import { Area } from "./area.modelos";
import { Employee } from "./employee.modelos";

export interface CostCenter {
  id: number;
  name: string;
  code: string;
  description: string;
  responsible: Employee;
  status: boolean;
  area: Area;
}