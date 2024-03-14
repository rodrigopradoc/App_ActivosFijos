import { Employee } from "./employee.modelos";

export interface Area {
  id: number;
  name: string;
  description: string;
  responsible: Employee;
}
  