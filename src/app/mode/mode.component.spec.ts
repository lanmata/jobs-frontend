import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModeComponent} from './mode.component';
import {DebugElement} from "@angular/core";
import {ModeService} from "./mode.service";
import {of, throwError} from "rxjs";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

describe('ModeComponent', () => {
    let component: ModeComponent;
    let fixture: ComponentFixture<ModeComponent>;
    let modeService: ModeService;
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
            imports: [ModeComponent,
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

        fixture = TestBed.createComponent(ModeComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        modeService = debugElement.injector.get(ModeService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list modes including inactive ones when requested', () => {
        const mockModes = {
            modeTOCollection: [
                {
                    id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
                    name: 'ModeModel 1',
                    description: 'Description ModeModel 1',
                    active: true
                },
                {
                    id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
                    name: 'ModeModel 2',
                    description: 'Description ModeModel 2',
                    active: false
                }
            ]
        };

        spyOn(modeService, 'getModes').and.returnValue(of(mockModes));
        component.ngOnInit();

        expect(component.allData).toEqual(mockModes.modeTOCollection);
    });

    it('should handle error when listing modes fails', () => {
        const errorResponse = new Error('Error occurred while getting modes');
        spyOn(modeService, 'getModes').and.returnValue(throwError(errorResponse));
        component.ngOnInit();
        expect(component.isErrorFound).toBeTrue();
    });

});
