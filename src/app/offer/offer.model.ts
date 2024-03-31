/**
 * Model class for Offer
 */
export class Offer {
  id!: string;
  mount!: number;
  createdDate!: Date;
  lastModifiedDate!: Date;
  status!: string;
  company!: string;
  position!: string;
  term!: string;
  mode!: string;
  source!: string;
}

export class NewOfferRequest {
  id!: string;
  title!: string;
  description!: string;
  reference!: string;
  dateTime!: string;
  statusId!: string;
  companyId!: string;
  positionId!: string;
  termId!: string;
  modeId!: string;
  sourceId!: string
  mountRate!: number;
}
