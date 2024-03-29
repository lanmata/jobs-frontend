export class Company {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class CompanyCollection {
  companies!: Company[];
}
