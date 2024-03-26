import {TestBed} from '@angular/core/testing';

import {StatusService} from './status.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('StatusService', () => {
  let service: StatusService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatusService]
    });

    service = TestBed.inject(StatusService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch status including inactive ones when requested', () => {
    const mockStatus = [
      {id: 1, name: 'Source 1', isActive: true},
      {id: 2, name: 'Source 2', isActive: false}
    ];

    service.getStatus(true).subscribe(status => {
      expect(status.length).toBe(2);
      expect(status).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/status?includeInactive=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);
  });

  it('should fetch only active status when requested', () => {
    const mockStatus = [
      {id: 1, name: 'Source 1', isActive: true}
    ];

    service.getStatus(false).subscribe(status => {
      expect(status.length).toBe(1);
      expect(status).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/status?includeInactive=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);
  });

  it('should handle error when fetching status fails', () => {
    service.getStatus(true).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/status?includeInactive=true`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });
});
