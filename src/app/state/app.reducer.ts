import { createReducer, on } from '@ngrx/store';
import { setSharedData } from './app.action';
import { AppState, initialState } from './app.state';

export const appReducer = createReducer(
  initialState,
  on(setSharedData, (state, { data }) => ({ ...state, sharedData: data }))
);