export class ModeModel {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class ModeCollection {
  modes!: ModeModel[];
}
