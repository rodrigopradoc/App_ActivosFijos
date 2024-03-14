import { Employee } from "./employee.modelos";

export interface CompanyLocal {
  id: number;
  name: string;
  description: string;
  district: string;
  street: string;
  apartment: string;
  state: string;
  postalCode: string;
  country: string;
  responsible: Employee;
}