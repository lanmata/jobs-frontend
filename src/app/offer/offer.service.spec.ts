import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {OfferService} from './offer.service';
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('OfferService', () => {
  let service: OfferService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfferService]
    });

    service = TestBed.inject(OfferService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch offers successfully', () => {
    const mockOffers = [
      { id: 1, title: 'Offer 1' },
      { id: 2, title: 'Offer 2' }
    ];

    service.getOffers().subscribe(offers => {
      expect(offers.length).toBe(2);
      expect(offers).toEqual(mockOffers);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers/collection`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOffers);
  });

  it('should handle error when fetching offers fails', () => {
    service.getOffers().subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers/collection`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
