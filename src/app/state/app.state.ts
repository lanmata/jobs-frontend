export interface AppState {
  sharedData: SharedData;
}

export const initialState: AppState = {
  sharedData: {logged: false, userAuth: {alias: ''}}
};

export class SharedData {
  logged!: boolean;
  userAuth!: UserAuth;
}

export class UserAuth {
  alias!: string;
}