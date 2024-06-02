import {TestBed} from '@angular/core/testing';

import {ModeService} from './mode.service';
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ModeService', () => {
    let service: ModeService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [ModeService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

        service = TestBed.inject(ModeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch modes including inactive ones when requested', () => {
        const mockModes = [
            {id: 1, name: 'Mode 1', isActive: true},
            {id: 2, name: 'Mode 2', isActive: false}
        ];

        service.getModes(true).subscribe(modes => {
            expect(modes.length).toBe(2);
            expect(modes).toEqual(mockModes);
        });

        const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/modes?includeInactive=true`);
        expect(req.request.method).toBe('GET');
        req.flush(mockModes);
    });

    it('should fetch only active modes when requested', () => {
        const mockModes = [
            {id: 1, name: 'Modes 1', isActive: true}
        ];

        service.getModes(false).subscribe(modes => {
            expect(modes.length).toBe(1);
            expect(modes).toEqual(mockModes);
        });

        const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/modes?includeInactive=false`);
        expect(req.request.method).toBe('GET');
        req.flush(mockModes);
    });

    it('should handle error when fetching modes fails', () => {
        service.getModes(true).subscribe(
            () => fail('Should have failed with 404 error'),
            (error: any) => {
                expect(error.status).toEqual(404);
                expect(error.error).toContain('Not Found');
            }
        );

        const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/modes?includeInactive=true`);
        req.flush('Not Found', {status: 404, statusText: 'Not Found'});
    });
});
