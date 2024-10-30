import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PositionComponent} from './position.component';
import {PositionService} from "./position.service";
import {DebugElement} from "@angular/core";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

describe('PositionComponent', () => {
    let component: PositionComponent;
    let fixture: ComponentFixture<PositionComponent>;
    let positionService: PositionService;
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
            imports: [PositionComponent,
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

        fixture = TestBed.createComponent(PositionComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        positionService = debugElement.injector.get(PositionService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should list positions including inactive ones when requested', () => {
        const mockPositions = {
            positionTOCollection: [
                {
                    id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
                    name: 'Position 1',
                    description: 'Description Position 1',
                    active: true
                },
                {
                    id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
                    name: 'Position 2',
                    description: 'Description Position 2',
                    active: false
                }
            ]
        };

        spyOn(positionService, 'getPositions').and.returnValue(of(mockPositions));
        component.ngOnInit();

        expect(component.allData).toEqual(mockPositions.positionTOCollection);
    });

    it('should handle error when listing positions fails', () => {
        const errorResponse = new Error('Error occurred while getting positions');
        spyOn(positionService, 'getPositions').and.returnValue(throwError(errorResponse));
        component.ngOnInit();
        expect(component.isErrorFound).toBeTrue();
    });

});
