import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusComponent} from './status.component';
import {DebugElement} from "@angular/core";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {StatusService} from "./status.service";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

describe('StatusComponent', () => {
    let component: StatusComponent;
    let fixture: ComponentFixture<StatusComponent>;
    let statusService: StatusService;
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
            imports: [StatusComponent,
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

        fixture = TestBed.createComponent(StatusComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        statusService = debugElement.injector.get(StatusService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list status including inactive ones when requested', () => {
        const mockStatus = {
            statusTOCollection: [
                {
                    id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
                    name: 'StatusModel 1',
                    description: 'Description StatusModel 1',
                    active: true
                },
                {
                    id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
                    name: 'StatusModel 2',
                    description: 'Description StatusModel 2',
                    active: false
                }
            ]
        };

        spyOn(statusService, 'getStatus').and.returnValue(of(mockStatus));
        component.ngOnInit();

        expect(component.allData).toEqual(mockStatus.statusTOCollection);
    });

    it('should handle error when listing status fails', () => {
        const errorResponse = new Error('Error occurred while getting status');
        spyOn(statusService, 'getStatus').and.returnValue(throwError(errorResponse));
        component.ngOnInit();
        expect(component.isErrorFound).toBeTrue();
    });

    it('should log message when adding status', () => {
        spyOn(console, 'log');
        const element = {id: 1, name: 'Test'};
        component.addStatus(element);
        expect(console.log).toHaveBeenCalledWith('Adding status', element);
    });

    it('should log message when deleting status', () => {
        spyOn(console, 'log');
        const element = {id: 1, name: 'Test'};
        component.deleteStatus(element);
        expect(console.log).toHaveBeenCalledWith('Deleting status', element);
    });

    it('should log message when exporting to excel', () => {
        spyOn(console, 'log');
        component.exportToExcel();
        expect(console.log).toHaveBeenCalledWith('Export status list to excel');
    });

    it('should log message and return false when showing inactive', () => {
        spyOn(console, 'log');
        const result = component.showInactive();
        expect(console.log).toHaveBeenCalledWith('Showing inactive');
        expect(result).toBeFalse();
    });

});
