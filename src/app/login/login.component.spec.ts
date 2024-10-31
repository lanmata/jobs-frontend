import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {LoginComponent} from './login.component';
import {LoadingService} from '@shared/services/loading.service';
import {AppConst} from '@shared/util/app-const';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let debugElement: DebugElement;
    let mockStore: any;
    let mockRouter: any;
    let mockActivatedRoute: ActivatedRoute;
    let mockLoadingService: any;

    beforeEach(async () => {
        mockStore = {
            select: jasmine.createSpy().and.returnValue(of({})),
            dispatch: jasmine.createSpy()
        };
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            events: of({}),
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('')
        } as any;
        mockLoadingService = {
            show: jasmine.createSpy()
        };
        mockActivatedRoute = {
            snapshot: {
                params: of({offerId: '0645d0de-fe0d-488c-920b-91145ac35387'})
            }
        } as any;

        await TestBed.configureTestingModule({
            imports: [LoginComponent,
                ReactiveFormsModule,
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
                {provide: Store, useValue: mockStore},
                {provide: Router, useValue: mockRouter},
                {provide: LoadingService, useValue: mockLoadingService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with default values', () => {
        expect(component.loginForm.value).toEqual({
            alias: '',
            password: '',
            remember: null
        });
    });

    it('should not validate access if form is invalid', () => {
        component.loginForm.controls['alias'].setValue('');
        component.loginForm.controls['password'].setValue('');
        component.validateAccess();
        expect(component.submitted).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should validate access if form is valid', () => {
        component.loginForm.controls['alias'].setValue('validAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.validateAccess();
        expect(component.submitted).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should sign in and navigate to offer path', () => {
        component.sharedDataCurrent = {logged: false};
        component.signin();
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({logged: true})
        }));
        expect(mockRouter.navigate).toHaveBeenCalledWith([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
    });

    it('should show loader on init', () => {
        component.ngOnInit();
        expect(mockLoadingService.show).toHaveBeenCalled();
    });

    it('should update shared data on subscription', () => {
        component.sharedDataCurrent = {logged: false};
        component.signin();
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({logged: true})
        }));
    });
});
