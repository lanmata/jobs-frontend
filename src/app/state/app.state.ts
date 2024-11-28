export interface AppState {
  sharedData: SharedData;
}

export const initialState: AppState = {
  sharedData: {logged: false, userAuth: {
          alias: '',
          fullName: "",
          sessionTokenBkd: ""
      }}
};

export class SharedData {
  logged!: boolean;
  userAuth!: UserAuth;
}

export class UserAuth {
  alias!: string;
  fullName!: string;
  sessionTokenBkd!: string;
}