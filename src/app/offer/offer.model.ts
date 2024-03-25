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
