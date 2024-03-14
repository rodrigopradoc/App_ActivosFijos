export interface DetailMaster {
  headMaster: HeadMaster;
  id: number;
  code: string;
  name: string;
  description: string;
  observation: string;
  status: boolean;
  value1: string;
  value2: string;
  abbreviation: string;
}

export interface HeadMaster {
  name: string;
  description: string;
  status: boolean;
  observation: string;
}