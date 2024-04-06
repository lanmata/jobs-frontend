export class ModeModel {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class ModeCollection {
  modes!: ModeModel[];
}

export const UNIT_TEST_MOCK_GET_MODE_RESPONSE = [
  {id: 'cfa1b09c-bd55-405d-b971-c408b2ed54ca', name: 'Mode 1', isActive: true},
  {id: 'e5f3d6bb-2570-452b-8367-a7d67a1c2d33', name: 'Mode 2', isActive: false}
];
