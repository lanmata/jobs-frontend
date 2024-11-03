import {createReducer, on} from '@ngrx/store';
import {setSharedData} from './app.action';
import {initialState} from './app.state';

export const appReducer = createReducer(
  initialState,
  on(setSharedData, (state, { data }) => ({ ...state, sharedData: data }))
);