/**
 * This class is used to hold the Position object.
 * It is used to define the structure of the Position object.
 */
export class Position {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

/**
 * This class is used to hold a collection of Position objects.
 * It is used to define the structure of the Position collection.
 */
export class PositionCollection {
  positions!: Position[];
}

export const UNIT_TEST_MOCK_GET_POSITION_RESPONSE =  [
  { id: '76b515c2-80bd-401b-8a6c-671bfb58b98b', name: 'Position 1', isActive: true },
  { id: '6d09d1ea-572a-4fcb-9efd-60db5fe59bea', name: 'Position 2', isActive: false }
];


