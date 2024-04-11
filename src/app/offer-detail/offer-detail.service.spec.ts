import {TestBed} from '@angular/core/testing';

import {OfferDetailService} from './offer-detail.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";

describe('OfferDetailService', () => {
  let service: OfferDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfferDetailService]
    });
    service = TestBed.inject(OfferDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete offer detail successfully', () => {
    const mockResponse = {status: 'success', message: 'Offer detail deleted successfully'};

    service.deleteOfferDetail('c2bcdcb4-6a6c-490f-8e09-e83f0e544649').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offer-details?jobOfferDetailId=c2bcdcb4-6a6c-490f-8e09-e83f0e544649`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should handle error when deleting offer detail fails', () => {
    service.deleteOfferDetail('9a48f614-072d-4475-a940-54bbb4f78943').subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offer-details?jobOfferDetailId=9a48f614-072d-4475-a940-54bbb4f78943`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });
});
