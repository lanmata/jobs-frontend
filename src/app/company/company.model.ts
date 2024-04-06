export class Company {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class CompanyCollection {
  companies!: Company[];
}

export const UNIT_TEST_MOCK_GET_COMPANY_RESPONSE =  [
  { id: 1, name: 'Company 1', isActive: true },
  { id: 2, name: 'Company 2', isActive: false }
];
