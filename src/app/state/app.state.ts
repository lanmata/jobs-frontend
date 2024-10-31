export interface AppState {
  sharedData: SharedData;
}

export const initialState: AppState = {
  sharedData: {logged: false}
};

export class SharedData {
  logged!: boolean;
}