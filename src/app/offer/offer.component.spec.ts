import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferComponent} from './offer.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {of, throwError} from "rxjs";
import {OfferService} from "./offer.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClient, HttpHeaders, HttpResponse, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {UNIT_TEST_MOCK_GET_STATUS_RESPONSE} from "../status/status.model";
import {UNIT_TEST_MOCK_ALL_DATA, UNIT_TEST_MOCK_GET_OFFER_RESPONSE} from "./offer.model";
import {DatePipe} from "@angular/common";
import {Store} from "@ngrx/store";
import {ReportService} from '@app/shared/services/report.service';


describe('OfferComponent', () => {
    let component: OfferComponent;
    let fixture: ComponentFixture<OfferComponent>;
    let offerService: OfferService;
    let reportService: ReportService;
    let debugElement: DebugElement;
    let mockActivatedRoute: ActivatedRoute;
    let mockRouter: Router;
    let mockStore: any;
    let mockDatePipe: any;

    beforeEach(async () => {
        mockStore = {
            select: jasmine.createSpy().and.returnValue(of({
                logged: false,
                userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
            })),
            dispatch: jasmine.createSpy()
        };
        mockDatePipe = {
            transform: jasmine.createSpy('transform').and.returnValue('2021-09-01')
        } as any;
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            events: of({}) // Mock the events property
        } as any;
        mockActivatedRoute = {
            snapshot: {
                params: of({offerId: '0645d0de-fe0d-488c-920b-91145ac35387'})
            }
        } as any;

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
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
                {provide: DatePipe, useValue: mockDatePipe},
                {provide: Store, useValue: mockStore},
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {provide: Router, useValue: mockRouter}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OfferComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        offerService = debugElement.injector.get(OfferService);
        reportService = debugElement.injector.get(ReportService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch offers on initialization', () => {
        const offerServiceSpy = spyOn(offerService, 'getOffers').and.returnValue(of(UNIT_TEST_MOCK_GET_STATUS_RESPONSE));
        component.ngOnInit();
        component.ngAfterViewInit();
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
        expect(component.allData).toEqual(UNIT_TEST_MOCK_ALL_DATA);
        expect(offerServiceSpy).toHaveBeenCalled();
    });

    it('should navigate to edit job offer', () => {
        component.ngOnInit();
        component.editJobOffer({id: '0645d0de-fe0d-488c-920b-91145ac35387'});
        expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should navigate to add job offer', () => {
        component.ngOnInit();
        component.addStatus({id: '0645d0de-fe0d-488c-920b-91145ac35387'});
    });

    it('should navigate to delete job offer', () => {
        component.ngOnInit();
        component.deleteJobOffer({id: '0645d0de-fe0d-488c-920b-91145ac35387'});
    });

    it('should navigate to create job offer', () => {
        component.ngOnInit();
        component.create();
    });

    it('should call showInactive', () => {
        component.ngOnInit();
        const result = component.showInactive();
        expect(result).toBeFalse();
    });

    it('should call isSelected', () => {
        component.ngOnInit();
        const result = component.isSelected(1);
        expect(result).toBeFalse();
    });

    it('should call rowSelect', () => {
        component.ngOnInit();
        component.rowSelect(1);
    });

    it('should export job offers to an Excel file', () => {
        const response = new HttpResponse({
            headers: new HttpHeaders({'Content-Disposition': 'attachment; filename="test_file.xlsx"'}),
            body: {content: btoa('mockContent')}
        });
        const reportServiceSpy = spyOn(reportService, 'getReports')
            .and.returnValue(of(response));
        component.ngOnInit();
        component.exportToExcel();
        expect(reportServiceSpy).toHaveBeenCalled();
    });

    it('should return filename from response headers', () => {
        const response = new HttpResponse({
            headers: new HttpHeaders({'Content-Disposition': 'attachment; filename="test_file.xlsx"'})
        });
        const filename = component['getFilename'](response, {filename: 'default', extension: 'xlsx'});
        expect(filename).toBe('test_file.xlsx');
    });

    it('should return default filename if no filename in response headers', () => {
        const response = new HttpResponse({});
        const filename = component['getFilename'](response, {filename: 'default', extension: 'xlsx'});
        expect(filename).toBe('default');
    });

});
