export class Term {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class TermCollection {
  terms!: Term[];
}
