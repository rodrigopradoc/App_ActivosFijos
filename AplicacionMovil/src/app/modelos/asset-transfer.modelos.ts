export interface AssetTransfer {
  code: string;
  approvedFlag: boolean;
  assetId: number;
  transferResponsibleId: number;
  approvalUserId: number;
  previousLocationId: number;
  finalLocationId: number;
  transferTypeId: number;
  projectId: number;
  additionalInformation: string;
  dateTransfer: string;
  hourTransfer: string;
}