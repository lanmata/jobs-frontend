import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {OfferService} from './offer.service';
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {UNIT_TEST_MOCK_NEW_OFFER_REQUEST, UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST} from "./offer.model";

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
      {id: 1, title: 'Offer 1'},
      {id: 2, title: 'Offer 2'}
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
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });

  it('should post offer successfully', () => {
    const mockResponse = {status: 'success', message: 'Offer posted successfully'};

    service.postOffer(UNIT_TEST_MOCK_NEW_OFFER_REQUEST).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error when posting offer fails', () => {

    service.postOffer(UNIT_TEST_MOCK_NEW_OFFER_REQUEST).subscribe(
      () => fail('Should have failed with 500 error'),
      (error: any) => {
        expect(error.status).toEqual(500);
        expect(error.error).toContain('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers`);
    req.flush('Internal Server Error', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should fetch a specific offer successfully', () => {
    const mockOffer = {id: '16fb0736-45cf-4d93-90ab-3d8306570a0a', title: 'Offer 1'};

    service.getOffer('16fb0736-45cf-4d93-90ab-3d8306570a0a').subscribe(offer => {
      expect(offer).toEqual(mockOffer);
    });

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers?jobOfferId=16fb0736-45cf-4d93-90ab-3d8306570a0a`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOffer);
  });

  it('should handle error when fetching a specific offer fails', () => {
    const offerId = '6c62a8b9-eefe-4c06-8216-79e49c0af0e7';
    service.getOffer(offerId).subscribe(
      () => fail('Should have failed with 404 error'),
      (error: any) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('Not Found');
      }
    );

    const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers?jobOfferId=${offerId}`);
    req.flush('Not Found', {status: 404, statusText: 'Not Found'});
  });

  it('should update offer successfully', () => {
  const mockResponse = { status: 'success', message: 'Offer updated successfully' };
  const offerId = '8eee8b49-bf5a-4f87-a544-ba02ea7738fb';
  service.putOffer(offerId, UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers/${offerId}/detail`);
  expect(req.request.method).toBe('PUT');
  req.flush(mockResponse);
});

it('should handle error when updating offer fails', () => {
  const offerId = '8eee8b49-bf5a-4f87-a544-ba02ea7738fb';
  service.putOffer(offerId, UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST).subscribe(
    () => fail('Should have failed with 500 error'),
    (error: any) => {
      expect(error.status).toEqual(500);
      expect(error.error).toContain('Internal Server Error');
    }
  );

  const req = httpMock.expectOne(`${JOB_BACKEND_SERVICE_BASE_URL}/job-offers/${offerId}/detail`);
  req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
});
});
