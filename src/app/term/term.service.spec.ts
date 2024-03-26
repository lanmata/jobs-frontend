import { TestBed } from '@angular/core/testing';

import { TermService } from './term.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('TermService', () => {
  let service: TermService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TermService]
    });

    service = TestBed.inject(TermService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch term including inactive ones when requested', () => {
    const mockStatus = [
      {id: 1, name: 'Term 1', isActive: true},
      {id: 2, name: 'Term 2', isActive: false}
    ];

    service.getTerm(true).subscribe(term => {
      expect(term.length).toBe(2);
      expect(term).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/terms?includeInactive=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);
  });

  it('should fetch only active term when requested', () => {
    const mockStatus = [
      {id: 1, name: 'Term 1', isActive: true}
    ];

    service.getTerm(false).subscribe(term => {
      expect(term.length).toBe(1);
      expect(term).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/terms?includeInactive=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);
  });

  it('should handle error when fetching term fails', () => {
    service.getTerm(true).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/terms?includeInactive=true`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });
});
