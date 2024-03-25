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


