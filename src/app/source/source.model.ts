export class Source {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class SourceCollection {
  sources!: Source[];
}
