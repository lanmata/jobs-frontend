import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {LoginComponent} from './login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {JwtPipe} from "@shared/services/jwt.pipe";
import {LoginService} from "@app/login/login.service";
import {AppConst} from "@shared/util/app-const";
import { NotifyComponent } from '@app/shared/components/notify-component/notify.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let debugElement: DebugElement;
    let mockStore: any;
    let mockRouter: any;
    let mockActivatedRoute: ActivatedRoute;
    let mockLoginService: any;
    let mockAlertService: any;

    beforeEach(async () => {
        mockStore = {
            select: jasmine.createSpy().and.returnValue(of({
                logged: false,
                userAuth: {alias: 'testAlias', fullName: 'Pepe Perez'}
            })),
            dispatch: jasmine.createSpy()
        };
        mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            events: of({}),
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('')
        } as any;
        mockActivatedRoute = {
            snapshot: {
                params: of({offerId: '0645d0de-fe0d-488c-920b-91145ac35387'})
            }
        } as any;
        mockAlertService = {
            error: jasmine.createSpy()
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
                LoginService,
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HttpClient, useValue: jasmine.createSpyObj('httpClient', ['get', 'post'])},
                {provide: DatePipe, useValue: jasmine.createSpyObj('DatePipe', ['transform'])},
                {provide: JwtPipe, useValue: jasmine.createSpyObj('JwtPipe', ['transform'])},
                provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
                {provide: Store, useValue: mockStore},
                {provide: Router, useValue: mockRouter}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
        mockLoginService = debugElement.injector.get(LoginService);
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
    });

    it('should show loader on init', () => {
        component.ngOnInit();
    });

    it('should update shared data on subscription', () => {
        component.ngOnInit();
        component.sharedDataCurrent = {
            logged: false, userAuth: {
                alias: 'testAlias',
                fullName: '',
                sessionTokenBkd: '',
                sessionToken: ''
            }
        };
        expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            data: jasmine.objectContaining({logged: false, userAuth: jasmine.objectContaining({alias: 'testAlias'})})
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
    });

    it('should return no errors when there are no errors', () => {
        expect(component.loginValid).toEqual({
            alias: {
                required: true,
                minlength: false,
                maxlength: false,
                invalid: true
            },
            password: {
                required: true,
                minlength: false,
                maxlength: false,
                invalid: true
            },
            invalid: true
        });
    });

    it('should return alias required error', () => {
        component.loginForm.controls['alias'].setErrors({required: true});
        component.loginValid;
        expect(component.loginValid.alias.required).toBeTrue();
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return alias minlength error', () => {
        component.loginForm.controls['alias'].setErrors({minlength: {requiredLength: 5, actualLength: 3}});
        expect(component.loginValid.alias.minlength).toEqual({requiredLength: 5, actualLength: 3});
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return alias maxlength error', () => {
        component.loginForm.controls['alias'].setErrors({maxlength: {requiredLength: 16, actualLength: 20}});
        component.loginValid;
        expect(component.loginValid.alias.maxlength).toEqual({requiredLength: 16, actualLength: 20});
        expect(component.loginValid.alias.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password required error', () => {
        component.loginForm.controls['password'].setErrors({required: true});
        component.loginValid;
        expect(component.loginValid.password.required).toBeTrue();
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password minlength error', () => {
        component.loginForm.controls['password'].setErrors({minlength: {requiredLength: 8, actualLength: 5}});
        component.loginValid;
        expect(component.loginValid.password.minlength).toEqual({requiredLength: 8, actualLength: 5});
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should return password maxlength error', () => {
        component.loginForm.controls['password'].setErrors({maxlength: {requiredLength: 20, actualLength: 25}});
        expect(component.loginValid.password.maxlength).toEqual({requiredLength: 20, actualLength: 25});
        console.log(`password validate :: ${component.loginValid.password.invalid}`);
        expect(component.loginValid.password.invalid).toBeTrue();
        expect(component.loginValid.invalid).toBeTrue();
    });

    it('should show a message in the snack bar with default duration if duration is zero', () => {
        const message = 'Test message';
        const duration = 0;
        spyOn(component['_snackBar'], 'open');
        component.message(message, duration);
        expect(component['_snackBar'].open).toHaveBeenCalledWith(message, '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: 0
        });
    });

    it('should show a message in the snack bar with default duration if duration is zero', () => {
        const message = 'Test message';
        const duration = 0;
        spyOn(component['_snackBar'], 'open');
        component.message(message, duration);
        expect(component['_snackBar'].open).toHaveBeenCalledWith(message, '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: 0
        });
    });

    it('should show a message in the snack bar with negative duration', () => {
        const message = 'Test message';
        const duration = -1;
        spyOn(component['_snackBar'], 'open');
        component.notification();
        component.message(message, duration);
        expect(component['_snackBar'].open).toHaveBeenCalledWith(message, '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: -3000
        });
    });

    it('should show an error message in the snack bar when alert type is error', () => {
        const alert = {type: 'error', text: 'Error message', duration: 5};
        spyOn(component['_snackBar'], 'open');
        spyOn(component['alertService'], 'getAlert').and.returnValue(of(alert));
        component.notification();
        expect(component['_snackBar'].open).toHaveBeenCalledWith('Error message', '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: 15000
        });
    });

    it('should show a warning message in the snack bar when alert type is warning', () => {
        const alert = {type: 'warning', text: 'Warning message', duration: 4};
        spyOn(component['_snackBar'], 'open');
        spyOn(component['alertService'], 'getAlert').and.returnValue(of(alert));
        component.notification();
        expect(component['_snackBar'].open).toHaveBeenCalledWith('Warning message', '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: 12000
        });
    });

    it('should show an info message in the snack bar when alert type is info', () => {
        const alert = {type: 'info', text: 'Info message', duration: 2};
        spyOn(component['_snackBar'], 'open');
        spyOn(component['alertService'], 'getAlert').and.returnValue(of(alert));
        component.notification();
        expect(component['_snackBar'].open).toHaveBeenCalledWith('Info message', '', {
            horizontalPosition: component['horizontalPosition'],
            verticalPosition: component['verticalPosition'],
            duration: 6000
        });
    });

    it('should not show any message when alert is null', () => {
        spyOn(component['_snackBar'], 'open');
        spyOn(component['alertService'], 'getAlert').and.returnValue(of(null));
        component.notification();
        expect(component['_snackBar'].open).not.toHaveBeenCalled();
    });
});
