import {JwtPipe} from './jwt.pipe';
import {CustomJwtPayload} from '@shared/model/custom-jwt-payload';
import {jwtDecode} from "jwt-decode";

describe('JwtPipe', () => {
    let pipe: JwtPipe;

    beforeEach(() => {
        pipe = new JwtPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return null for an invalid JWT token', () => {
        const token = 'invalid.jwt.token';

        const result = pipe.transform(token);

        expect(result).toBeNull();
    });

    it('should return null for an empty JWT token', () => {
        const token = '';
        const result = pipe.transform(token);

        expect(result).toBeNull();
    });
});