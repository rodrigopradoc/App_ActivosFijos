import { Area } from "./area.modelos";
import { CompanyLocal } from "./company-local.modelos";
import { CostCenter } from "./cost-center.modelos";
import { Enviroment } from "./enviroment.modelos";
import { DetailMaster } from "./master.interface";

export interface Location {
  id: number;
  name: string;
  code: string;
  type: DetailMaster;
  area: Area;
  companyLocal: CompanyLocal;
  enviroment: Enviroment;
  costCenter: CostCenter;
}

export interface ListLocationDto {
  name?: string;
  areaId?: number;
  enviromentId?: number;
  companyLocalId?: number;
}

export interface Ubicacion {
  local: CompanyLocal;
  area: Area;
  piso: number;
  ambiente: Enviroment;
}