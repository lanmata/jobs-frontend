import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferComponent} from './offer.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {of, throwError} from "rxjs";
import {OfferService} from "./offer.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {UNIT_TEST_MOCK_GET_STATUS_RESPONSE} from "../status/status.model";
import {UNIT_TEST_MOCK_GET_OFFER_RESPONSE} from "./offer.model";

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;
  let offerService: OfferService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OfferComponent,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        OfferService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    params: of({ offerId: '0645d0de-fe0d-488c-920b-91145ac35387' })
                }
            }
        },
        { provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post']) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    offerService = debugElement.injector.get(OfferService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offers on initialization', () => {
    const offerServiceSpy = spyOn(offerService, 'getOffers').and.returnValue(of(UNIT_TEST_MOCK_GET_STATUS_RESPONSE));
    component.ngOnInit();
    expect(offerServiceSpy).toHaveBeenCalled();
  });

  it('should handle error while getting offers', () => {
    const errorResponse = new Error('Error occurred while getting offers');
    spyOn(offerService, 'getOffers').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

  it('should update data source when offers are fetched', () => {
    const offerServiceSpy = spyOn(offerService, 'getOffers').and.returnValue(of(UNIT_TEST_MOCK_GET_OFFER_RESPONSE));
    component.ngOnInit();
    expect(component.allData).toEqual(UNIT_TEST_MOCK_GET_OFFER_RESPONSE);
    expect(offerServiceSpy).toHaveBeenCalled();
  });

});
