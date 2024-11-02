import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditOfferComponent} from './edit-offer.component';
import {OfferService} from '../offer.service';
import {of, throwError} from 'rxjs';
import {UNIT_TEST_MOCK_OFFER_EDIT, UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST} from '../offer.model';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {DebugElement} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {StatusService} from "@app/status/status.service";
import {UNIT_TEST_MOCK_GET_STATUS_RESPONSE} from "@app/status/status.model";

describe('EditOfferComponent', () => {
    let component: EditOfferComponent;
    let fixture: ComponentFixture<EditOfferComponent>;
    let offerService: OfferService;
    let statusService: StatusService;
    let activatedRoute: ActivatedRoute;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditOfferComponent,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })],
            providers: [
                DatePipe,
                TranslateService,
                OfferService,
                StatusService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: of({offerId: '0645d0de-fe0d-488c-920b-91145ac35387'})
                        }
                    }
                },
                {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'put'])},
                {provide: DatePipe, useValue: jasmine.createSpyObj('DatePipe', ['transform'])},
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        activatedRoute = TestBed.inject(ActivatedRoute);
        activatedRoute.snapshot.params = {offerId: '0645d0de-fe0d-488c-920b-91145ac35387'};
        fixture = TestBed.createComponent(EditOfferComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        offerService = debugElement.injector.get(OfferService);
        statusService = debugElement.injector.get(StatusService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load offer on init', () => {
        const mockOfferService = spyOn(offerService, 'getOffer')
            .and.returnValue(of(UNIT_TEST_MOCK_OFFER_EDIT));
        const mockStatusService = spyOn(statusService, 'getStatus')
            .and.returnValue(of(UNIT_TEST_MOCK_GET_STATUS_RESPONSE));
        component.ngOnInit();

        expect(mockOfferService).toHaveBeenCalled();
        expect(mockStatusService).toHaveBeenCalled();
        expect(component.offer).toEqual(UNIT_TEST_MOCK_OFFER_EDIT);
        fixture.detectChanges();
    });

    it('should update offer', () => {
        const mockOfferServiceGetOffer = spyOn(offerService, 'getOffer')
            .and.returnValue(of(UNIT_TEST_MOCK_OFFER_EDIT));
        const mockStatusService = spyOn(statusService, 'getStatus')
            .and.returnValue(of(UNIT_TEST_MOCK_GET_STATUS_RESPONSE));
        const mockOfferServicePutOffer = spyOn(offerService, 'putOffer')
            .and.returnValue(of({
                id: "0645d0de-fe0d-488c-920b-91145ac35387",
                jobOfferDetailId: "ca792661-27d8-4b95-b7b0-e72ccc143aef",
                createdDate: "2024-04-04 07:12:26",
                message: "Job offer updated"
            }));
        component.ngOnInit();
        spyOn(component['formatUtil'], 'datetimeStandard').and.returnValue('2022-01-01 12:00:00');
        component.editOfferForm.controls['status'].setValue('ca792661-27d8-4b95-b7b0-e72ccc143aef');
        component.editOfferForm.controls['comments'].setValue('Test Comment');
        component.editOfferForm.controls['updateDate'].setValue('2022-01-01 12:00:00');
        component.updateOffer();

        expect(mockOfferServiceGetOffer).toHaveBeenCalledWith(component.jobOfferId);
        expect(mockOfferServicePutOffer).toHaveBeenCalledWith(component.jobOfferId, UNIT_TEST_MOCK_OFFER_UPDATE_REQUEST);
        expect(mockStatusService).toHaveBeenCalledWith(false);
    });

    it('should clean form values', () => {
        component.cleanValues();

        expect(component.editOfferForm.controls['status'].value).toBeNull();
        expect(component.editOfferForm.controls['updateDate'].value).toBeNull();
        expect(component.editOfferForm.controls['comments'].value).toBeNull();
    });

    it('should display success notification on offer update success', () => {
        const mockOfferServicePutOffer = spyOn(offerService, 'putOffer')
            .and.returnValue(of({
                id: "3ae33d7a-6762-48b7-b5f4-372434071260",
                jobOfferDetailId: "cefaf470-e7e4-4ad2-b5e2-2373ab0796f8",
                createdDate: "2024-04-04 07:12:26",
                message: "Job offer updated"
            }));
        const mockAlertServiceSuccess = spyOn(component['alertService'], 'success');
        component.ngOnInit()
        component.editOfferForm.controls['status'].setValue('ca792661-27d8-4b95-b7b0-e72ccc143aef');
        component.editOfferForm.controls['updateDate'].setValue('2022-01-01 12:00:00');
        component.editOfferForm.controls['comments'].setValue('Test Comment');
        component.updateOffer();

        expect(mockOfferServicePutOffer).toHaveBeenCalled();
        expect(mockAlertServiceSuccess).toHaveBeenCalledWith('Updated offer #3ae33d7a-6762-48b7-b5f4-372434071260 successfully', true);
    });

    it('should display error notification on offer update failure', () => {
        const mockOfferServicePutOffer = spyOn(offerService, 'putOffer')
            .and.returnValue(throwError(() => new Error('Error updating offer')));
        const mockAlertServiceSuccess = spyOn(component['alertService'], 'success');
        component.ngOnInit()
        component.editOfferForm.controls['status'].setValue('ca792661-27d8-4b95-b7b0-e72ccc143aef');
        component.editOfferForm.controls['updateDate'].setValue('2022-01-01 12:00:00');
        component.editOfferForm.controls['comments'].setValue('Test Comment');
        component.updateOffer();

        expect(mockOfferServicePutOffer).toHaveBeenCalled();
        expect(mockAlertServiceSuccess).toHaveBeenCalledWith('We have an error processing the request.', true);
    });

    it('should display success notification on offer detail delete success', () => {
        const mockOfferDetailServiceDelete = spyOn(component['offerDetailService'], 'deleteOfferDetail')
            .and.returnValue(of({
                id: "cefaf470-e7e4-4ad2-b5e2-2373ab0796f8",
                message: "Job offer detail deleted"
            }));
        const mockAlertServiceSuccess = spyOn(component['alertService'], 'success');
        component.ngOnInit()
        component['deleteOfferDetail']('cefaf470-e7e4-4ad2-b5e2-2373ab0796f8');

        expect(mockOfferDetailServiceDelete).toHaveBeenCalled();
        expect(mockAlertServiceSuccess).toHaveBeenCalledWith('Deleted offer detail #cefaf470-e7e4-4ad2-b5e2-2373ab0796f8 successfully', true);
    });

    it('should display error notification on offer detail delete failure', () => {
        const mockOfferDetailServiceDelete = spyOn(component['offerDetailService'], 'deleteOfferDetail')
            .and.returnValue(throwError(() => new Error('Error deleting offer detail')));
        const mockAlertServiceSuccess = spyOn(component['alertService'], 'success');
        component.ngOnInit();
        component['deleteOfferDetail']('cefaf470-e7e4-4ad2-b5e2-2373ab0796f8');

        expect(mockOfferDetailServiceDelete).toHaveBeenCalled();
        expect(mockAlertServiceSuccess).toHaveBeenCalledWith('We have an error processing the request.', true);
    });
})
