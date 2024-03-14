import { DetailMaster } from "./master.interface";

export interface Employee {
  id: number;
  externalId?: string;
  documentType: DetailMaster;
  documentNumber: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  type: string;
  status: boolean;
  location: Location;
  position: string;
  costCenter: any; //TODO: Implement cost center entity
  initialDate: Date;
  endDate: Date;
}