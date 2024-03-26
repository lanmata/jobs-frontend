import {TestBed} from '@angular/core/testing';

import {SourceService} from './source.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('SourceService', () => {
  let service: SourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SourceService]
    });

    service = TestBed.inject(SourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch sources including inactive ones when requested', () => {
    const mockSources = [
      {id: 1, name: 'Source 1', isActive: true},
      {id: 2, name: 'Source 2', isActive: false}
    ];

    service.getSources(true).subscribe(sources => {
      expect(sources.length).toBe(2);
      expect(sources).toEqual(mockSources);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/sources?includeInactive=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSources);
  });

  it('should fetch only active sources when requested', () => {
    const mockSources = [
      {id: 1, name: 'Source 1', isActive: true}
    ];

    service.getSources(false).subscribe(sources => {
      expect(sources.length).toBe(1);
      expect(sources).toEqual(mockSources);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/sources?includeInactive=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSources);
  });

  it('should handle error when fetching sources fails', () => {
    service.getSources(true).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/sources?includeInactive=true`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });
});
