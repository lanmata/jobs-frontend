export class Company {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class CompanyCollection {
  companyTOCollection!: Company[];
}
