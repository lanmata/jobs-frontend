import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CompanyComponent} from './company.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {CompanyService} from "./company.service";
import {of, throwError} from "rxjs";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

describe('CompanyComponent', () => {
    let component: CompanyComponent;
    let fixture: ComponentFixture<CompanyComponent>;
    let companyService: CompanyService;
    let debugElement: DebugElement;
    let mockActivatedRoute: ActivatedRoute;
    let mockRouter: Router;

    beforeEach(async () => {
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
            imports: [CompanyComponent,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
                {provide: DatePipe, useValue: jasmine.createSpyObj('DatePipe', ['transform'])},
                provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
                {provide: Router, useValue: mockRouter}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CompanyComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        companyService = debugElement.injector.get(CompanyService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch companies on initialization', () => {
        const companyServiceSpy = spyOn(companyService, 'getCompanies').and.callThrough();
        component.ngOnInit();
        expect(companyServiceSpy).toHaveBeenCalled();
    });

    it('should handle error while getting companies', () => {
        const errorResponse = new Error('Error occurred while getting companies');
        spyOn(companyService, 'getCompanies').and.returnValue(throwError(errorResponse));
        component.ngOnInit();
        expect(component.isErrorFound).toBeTrue();
    });

    it('should update data source when companies are fetched', () => {
        const response = {companyTOCollection: [{id: 1, name: 'Company1'}, {id: 2, name: 'Company2'}]};
        spyOn(companyService, 'getCompanies').and.returnValue(of(response));
        component.ngOnInit();
        expect(component.allData).toEqual(response.companyTOCollection);
    });

    it('should hide loader when companies are fetched', () => {
        const response = {companyTOCollection: [{id: 1, name: 'Company1'}, {id: 2, name: 'Company2'}]};
        spyOn(companyService, 'getCompanies').and.returnValue(of(response));
        const loaderSpy = spyOn(component.loader, 'hide').and.callThrough();
        component.ngOnInit();
        expect(loaderSpy).toHaveBeenCalled();
    });
});
