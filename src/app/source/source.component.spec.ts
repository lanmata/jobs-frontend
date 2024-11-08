import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SourceComponent} from './source.component';
import {DebugElement} from "@angular/core";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {SourceService} from "./source.service";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

describe('SourceComponent', () => {
    let component: SourceComponent;
    let fixture: ComponentFixture<SourceComponent>;
    let sourceService: SourceService;
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
            imports: [SourceComponent,
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

        fixture = TestBed.createComponent(SourceComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        sourceService = debugElement.injector.get(SourceService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list sources including inactive ones when requested', () => {
        const mockSources = {
            list: [
                {
                    id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
                    name: 'Source 1',
                    description: 'Description Source 1',
                    active: true
                },
                {
                    id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
                    name: 'Source 2',
                    description: 'Description Source 2',
                    active: false
                }
            ]
        };

        spyOn(sourceService, 'getSources').and.returnValue(of(mockSources));
        component.ngOnInit();

        expect(component.allData).toEqual(mockSources.list);
    });

    it('should handle error when listing sources fails', () => {
        const errorResponse = new Error('Error occurred while getting sources');
        spyOn(sourceService, 'getSources').and.returnValue(throwError(errorResponse));
        component.ngOnInit();
        expect(component.isErrorFound).toBeTrue();
    });

    it('should log message when adding status', () => {
        spyOn(console, 'log');
        const element = {id: 1, name: 'Test'};
        component.addStatus(element);
        expect(console.log).toHaveBeenCalledWith('Adding status', element);
    });

    it('should log message when deleting source', () => {
        spyOn(console, 'log');
        const element = {id: 1, name: 'Test'};
        component.deleteSource(element);
        expect(console.log).toHaveBeenCalledWith('Deleting source', element);
    });

    it('should log message when exporting to excel', () => {
        spyOn(console, 'log');
        component.exportToExcel();
        expect(console.log).toHaveBeenCalledWith('Export slurce list to excel');
    });

    it('should log message and return false when showing inactive', () => {
        spyOn(console, 'log');
        const result = component.showInactive();
        expect(console.log).toHaveBeenCalledWith('Showing inactive');
        expect(result).toBeFalse();
    });

});
