import { Employee } from "./employee.modelos";

export interface Enviroment {
  id: number;
  name: string;
  responsible: Employee;
  floor: number;
  officeNumber: number;
  planeCode: string;
}