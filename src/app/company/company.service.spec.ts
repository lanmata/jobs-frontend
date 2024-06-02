import {TestBed} from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {CompanyService} from './company.service';
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [CompanyService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch companies successfully', () => {
    const mockCompanies = [
      { id: 1, name: 'Company 1', isActive: true },
      { id: 2, name: 'Company 2', isActive: false }
    ];

    service.getCompanies(true).subscribe(companies => {
      expect(companies.length).toBe(2);
      expect(companies).toEqual(mockCompanies);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/companies?includeInactive=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies);
  });

  it('should fetch only active companies', () => {
    const mockCompanies = [
      { id: 1, name: 'Company 1', isActive: true }
    ];

    service.getCompanies(false).subscribe(companies => {
      expect(companies.length).toBe(1);
      expect(companies).toEqual(mockCompanies);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/companies?includeInactive=false`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies);
  });

  it('should handle error when fetching companies fails', () => {
    service.getCompanies(true).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/companies?includeInactive=true`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
