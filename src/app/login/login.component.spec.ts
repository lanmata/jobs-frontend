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
            select: jasmine.createSpy().and.returnValue(of({logged: false, userAuth: {alias: 'testAlias'}})),
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
        expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should sign in and navigate to offer path', () => {
        component.loginForm.controls['alias'].setValue('testAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.signin();
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({
                logged: true,
                userAuth: jasmine.objectContaining({alias: 'testAlias'})
            })
        }));
        expect(mockRouter.navigate).toHaveBeenCalledWith([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
    });

    it('should show loader on init', () => {
        component.ngOnInit();
        expect(mockLoadingService.show).toHaveBeenCalled();
    });

    it('should update shared data on subscription', () => {
        component.ngOnInit();
        component.sharedDataCurrent = {logged: false, userAuth: {alias: 'testAlias'}};
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({logged: false, userAuth:  jasmine.objectContaining({ alias: 'testAlias' })})
        }));
    });

    it('should show an error message if form is invalid on submit', () => {
        component.loginForm.controls['alias'].setValue('');
        component.loginForm.controls['password'].setValue('');
        component.loginValid;
        component.validateAccess();
        expect(component.isErrorFound).toBeTrue();
    });

    it('should not show an error message if form is valid on submit', () => {
        component.loginForm.controls['alias'].setValue('validAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.loginValid;
        component.validateAccess();
        expect(component.isErrorFound).toBeFalse();
    });

    it('should update shared data on successful sign in', () => {
        component.loginForm.controls['alias'].setValue('validAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.loginValid;
        component.signin();
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({
                logged: true,
                userAuth: jasmine.objectContaining({alias: 'validAlias'})
            })
        }));
    });

    it('should navigate to offer path on successful sign in', () => {
        component.loginForm.controls['alias'].setValue('validAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.loginValid;
        component.signin();
        expect(mockRouter.navigate).toHaveBeenCalledWith([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
    });

    it('should not navigate if form is invalid on validateAccess', () => {
        component.loginForm.controls['alias'].setValue('');
        component.loginForm.controls['password'].setValue('');
        component.loginValid;
        component.validateAccess();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate if form is valid on validateAccess', () => {
        component.loginForm.controls['alias'].setValue('validAlias');
        component.loginForm.controls['password'].setValue('validPassword123');
        component.loginValid;
        component.validateAccess();
        expect(mockRouter.navigate).toHaveBeenCalledWith([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
    });

    it('should return no errors when there are no errors', () => {
        expect(component.loginValid).toEqual({
            alias: {
                required: true,
                minlength: undefined,
                maxlength: undefined,
                invalid: true
            },
            password: {
                required: true,
                minlength: undefined,
                maxlength: undefined,
                invalid: true
            },
            invalid: true
        });
    });

    it('should return alias required error', () => {
        component.loginForm.controls['alias'].setErrors({ required: true });
        component.loginValid;
        expect(component.loginValid.alias.required).toBeTrue();
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return alias minlength error', () => {
        component.loginForm.controls['alias'].setErrors({ minlength: { requiredLength: 5, actualLength: 3 } });
        expect(component.loginValid.alias.minlength).toEqual({ requiredLength: 5, actualLength: 3 });
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return alias maxlength error', () => {
        component.loginForm.controls['alias'].setErrors({ maxlength: { requiredLength: 16, actualLength: 20 } });
        component.loginValid;
        expect(component.loginValid.alias.maxlength).toEqual({ requiredLength: 16, actualLength: 20 });
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password required error', () => {
        component.loginForm.controls['password'].setErrors({ required: true });
        component.loginValid;
        expect(component.loginValid.password.required).toBeTrue();
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password minlength error', () => {
        component.loginForm.controls['password'].setErrors({ minlength: { requiredLength: 8, actualLength: 5 } });
        component.loginValid;
        expect(component.loginValid.password.minlength).toEqual({ requiredLength: 8, actualLength: 5 });
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password maxlength error', () => {
        component.loginForm.controls['password'].setErrors({ maxlength: { requiredLength: 20, actualLength: 25 } });
        expect(component.loginValid.password.maxlength).toEqual({ requiredLength: 20, actualLength: 25 });
        console.log(`password validate :: ${component.loginValid.password.invalid}`);
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });
});
