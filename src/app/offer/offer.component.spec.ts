import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferComponent} from './offer.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {of, throwError} from "rxjs";
import {OfferService} from "./offer.service";

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;
  let offerService: OfferService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferComponent, HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    offerService = debugElement.injector.get(OfferService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch offers on initialization', () => {
    const offerServiceSpy = spyOn(offerService, 'getOffers').and.callThrough();
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
    const response = [{id: 1, name: 'Offer1'}, {id: 2, name: 'Offer2'}];
    spyOn(offerService, 'getOffers').and.returnValue(of(response));
    component.ngOnInit();
    expect(component.dataSource).toEqual(response);
  });

});
