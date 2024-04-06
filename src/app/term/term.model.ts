export class Term {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class TermCollection {
  terms!: Term[];
}

export const UNIT_TEST_MOCK_GET_TERM_RESPONSE =  [
  { id: '76b515c2-80bd-401b-8a6c-671bfb58b98b', name: 'Term 1', isActive: true },
  { id: '6d09d1ea-572a-4fcb-9efd-60db5fe59bea', name: 'Term 2', isActive: false }
];
