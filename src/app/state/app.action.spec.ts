import {setSharedData} from './app.action';
import {SharedData} from './app.state';

describe('App Actions', () => {
    it('should create setSharedData action with correct type and payload', () => {
        const data: SharedData = {logged: true};
        const action = setSharedData({data});
        expect(action.type).toBe('[Shared] Set Data');
        expect(action.data).toEqual(data);
    });

    it('should handle empty data payload', () => {
        const data: SharedData = new SharedData();
        const action = setSharedData({data});
        expect(action.type).toBe('[Shared] Set Data');
        expect(action.data).toEqual(data);
    });

});
