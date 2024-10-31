import {createAction, props} from '@ngrx/store';
import {SharedData} from './app.state';

export const setSharedData = createAction(
    '[Shared] Set Data',
    props<{ data: SharedData }>()
);