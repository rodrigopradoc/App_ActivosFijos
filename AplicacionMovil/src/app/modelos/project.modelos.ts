import { CostCenter } from "./cost-center.modelos";
import { Employee } from "./employee.modelos";

export interface Project {
  id: number;
  code: string;
  name: string;
  responsible: Employee;
  description: string;
  costCenter: CostCenter;
  startDate: Date;
  endDate: Date;
}