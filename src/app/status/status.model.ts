export class Status {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
}

export class StatusCollection {
  statuses: Status[] = [];
}

export const UNIT_TEST_MOCK_GET_STATUS_RESPONSE = {
  statusTOCollection: [
    {
      id: '2c7c9f5f-11b8-414d-b07d-cf82652cf31f',
      name: 'Cliente N001AB',
      description: 'Usuarios que requieren de los servicios habilitados en la plataforma',
      active: true
    },
    {
      id: 'c5c98d14-da56-461c-aff3-0bbdd8924a8e',
      name: 'Cliente N001AC',
      description: 'Usuarios que requieren de los servicios habilitados en la plataforma',
      active: true
    }
  ]
};
