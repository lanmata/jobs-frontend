import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {BACKBONE_SERVICE_BASE_URL} from '@shared/app.const';
import {LoginService} from './login.service';
import {TestBed} from "@angular/core/testing";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

describe('LoginService', () => {
    let service: LoginService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [LoginService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        });

        service = TestBed.inject(LoginService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve token successfully', () => {
        const mockResponse = {token: 'mock.jwt.token'};
        service.getToken('testUser', 'testPassword').subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${BACKBONE_SERVICE_BASE_URL}/session`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({alias: 'testUser', password: 'testPassword'});
        req.flush(mockResponse);
    });

    it('should handle error when retrieving token', () => {
        service.getToken('testUser', 'testPassword').subscribe(
            () => fail('should have failed with the 401 error'),
            (error) => {
                expect(error.status).toBe(401);
            }
        );

        const req = httpMock.expectOne(`${BACKBONE_SERVICE_BASE_URL}/session`);
        req.flush('Invalid credentials', {status: 401, statusText: 'Unauthorized'});
    });
});