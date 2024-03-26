import {TestBed} from '@angular/core/testing';

import {PositionService} from './position.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('PositionService', () => {
  let service: PositionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PositionService]
    });

    service = TestBed.inject(PositionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch positions including inactive ones when requested', () => {
    const mockPositions = [
      {id: 1, name: 'Positions 1', isActive: true},
      {id: 2, name: 'Positions 2', isActive: false}
    ];

    service.getPositions(true).subscribe(positions => {
      expect(positions.length).toBe(2);
      expect(positions).toEqual(mockPositions);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/positions?includeInactive=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPositions);
  });

  it('should fetch only active positions when requested', () => {
    const mockPositions = [
      {id: 1, name: 'Positions 1', isActive: true}
    ];

    service.getPositions(false).subscribe(positions => {
      expect(positions.length).toBe(1);
      expect(positions).toEqual(mockPositions);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/positions?includeInactive=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPositions);
  });

  it('should handle error when fetching positions fails', () => {
    service.getPositions(true).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/positions?includeInactive=true`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });
});
