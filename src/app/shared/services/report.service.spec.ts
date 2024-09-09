import {TestBed} from '@angular/core/testing';

import {ReportService} from './report.service';
import {OfferService} from "../../offer/offer.service";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

describe('ReportService', () => {
    let service: ReportService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [OfferService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
        });

        service = TestBed.inject(ReportService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
