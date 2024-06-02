import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferDetailConfirmDialogComponent} from './offer-detail-confirm-dialog.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {OfferService} from "../offer.service";
import {OfferDetailService} from "../../offer-detail/offer-detail.service";
import {AlertService} from "@shared/services/alert.service";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DebugElement} from "@angular/core";

describe('OfferDetailConfirmComponent', () => {
  let component: OfferDetailConfirmDialogComponent;
  let fixture: ComponentFixture<OfferDetailConfirmDialogComponent>;
  let matDialogRef: MatDialogRef<OfferDetailConfirmDialogComponent>;
  let debugElement: DebugElement;
  let offerDetailService: OfferDetailService;
  let offerService: OfferService;
  let alertService: AlertService;

  beforeEach(async () => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
    imports: [OfferDetailConfirmDialogComponent,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        AlertService,
        OfferService,
        TranslateService,
        OfferDetailService,
        { provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get']) },
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { data: '9ad27569-7778-4877-819f-57d24445b006' } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(OfferDetailConfirmDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    offerDetailService = debugElement.injector.get(OfferDetailService);
    offerService = debugElement.injector.get(OfferService);
    alertService = debugElement.injector.get(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true when onClick is called with true', () => {
    component.onClick(true);
    expect(matDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when onClick is called with false', () => {
    component.onClick(false);
    expect(matDialogRef.close).toHaveBeenCalledWith(false);
  }); it('should close dialog with true when onClick is called with true', () => {
    component.onClick(true);
    expect(matDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when onClick is called with false', () => {
    component.onClick(false);
    expect(matDialogRef.close).toHaveBeenCalledWith(false);
  });
});
