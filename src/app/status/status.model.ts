export class Status {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class StatusCollection {
  statuses!: Status[];
}
