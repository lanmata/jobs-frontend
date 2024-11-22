import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, Subject, takeUntil} from "rxjs";
import {LoadingService} from "@shared/services/loading.service";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FlexModule} from "@angular/flex-layout";
import {AppState, SharedData, UserAuth} from '@app/state/app.state';
import {Store} from '@ngrx/store';
import {setSharedData} from '@app/state/app.action';
import {AppConst} from "@shared/util/app-const";
import {LoginService} from "@app/login/login.service";
import {AlertService} from "@shared/services/alert.service";
import {NotifyComponent} from "@shared/components/notify-component/notify.component";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {JwtPipe} from '@app/shared/services/jwt.pipe';

/**
 * LoginComponent is responsible for handling the login functionality.
 * It includes form validation, state management, and navigation.
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, ReactiveFormsModule],
    providers: [JwtPipe],
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    /** Loading service */
    protected loader: LoadingService = inject(LoadingService);

    private readonly loginService = inject(LoginService);

    private readonly alertService: AlertService = inject(AlertService);

    /** Flag to indicate if an error was found */
    public isErrorFound = false;

    /** Function to log information */
    protected logInfo: (...arg: any) => void;

    /** Function to log errors */
    protected logError: (...arg: any) => void;

    /** Subject to handle component destruction */
    protected subject$: Subject<void> = new Subject<void>();

    /** Change detector reference */
    protected changeDetectorRefs = inject(ChangeDetectorRef);

    /** Router instance */
    private readonly router: Router = inject(Router);

    /** Application constants */
    protected readonly appConst = AppConst;

    /** Form builder */
    private readonly formBuilder = inject(FormBuilder);

    private readonly jwtPipe = inject(JwtPipe);

    /** Observable for shared data */
    sharedData$: Observable<SharedData>;

    /** Current shared data */
    sharedDataCurrent: SharedData = new SharedData();

    /** Flag to indicate if the form has been submitted */
    submitted = false;

    /** Flag to indicate if loading is in progress */
    loading = false;

    /** Login form group */
    loginForm: FormGroup;

    private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
    private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    private readonly verticalPosition: MatSnackBarVerticalPosition = 'top';

    /**
     * Constructor to initialize the component with necessary services and state.
     * @param store - The store to manage application state.
     */
    constructor(private readonly store: Store<{ app: AppState }>) {
        this.logInfo = (...arg: any) => console.info(arg);
        this.logError = (...arg: any) => console.error(arg);
        this.loginForm = this.formBuilder.group({
            alias: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
            password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
            remember: []
        });
        this.sharedData$ = store.select(state => state.app.sharedData);
    }

    /** Lifecycle hook that is called after the component's view has been fully initialized */
    ngAfterViewInit(): void {
        this.changeDetectorRefs.detectChanges();
    }

    /** Lifecycle hook that is called when the component is destroyed */
    ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }

    /** Lifecycle hook that is called when the component is initialized */
    ngOnInit(): void {
        this.loader.show();
        this.sharedData$.subscribe(data => {
            this.sharedDataCurrent = data;
        });
        const sharedDataUpdated = {...this.sharedDataCurrent, logged: false};
        this.store.dispatch(setSharedData({data: sharedDataUpdated}));
        this.notification();
    }

    /** Getter for form controls */
    get loginValid() {
        let aliasValid = this.validate(this.loginForm.controls['alias']);
        let passwordValid = this.validate(this.loginForm.controls['password']);
        const isInvalid = aliasValid.invalid || passwordValid.invalid;

        return {
            alias: aliasValid,
            password: passwordValid,
            invalid: isInvalid
        };
    }

    private validate(control: any): any {
        let deep = {
            required: false,
            minlength: false,
            maxlength: false,
            invalid: false
        };
        if (control?.errors) {
            if (control.errors['required']) {
                deep.required = control.errors['required'];
            }
            if (control.errors['minlength']) {
                deep.minlength = control.errors['minlength'];
            }
            if (control.errors['maxlength']) {
                deep.maxlength = control.errors['maxlength'];
            }
            if (deep.required || deep.minlength || deep.maxlength) {
                deep.invalid = true;
            }
        }
        return deep;
    }

    /**
     * Validates the access credentials entered in the form.
     * If the form is invalid, the method will return early.
     */
    public validateAccess(): void {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.signin();
        } else {
            this.isErrorFound = true;
            this.logError('Invalid form data');
        }
    }

    /**
     * Signs in the user by updating the shared data and navigating to the offer path.
     */
    signin(): void {
        this.loader.show();
        if (this.loginForm.valid) {
            const alias = this.loginForm.controls['alias'].value;
            const password = this.loginForm.controls['password'].value;
            let userAuth = new UserAuth();

            this.loginService.getToken(alias, password).pipe(takeUntil(this.subject$))
                .subscribe({
                    next: (response: any) => {
                        this.loader.hide?.();
                        const decodedToken =this.jwtPipe.transform(response.token);
                        if(decodedToken) {
                            userAuth = {
                                ...userAuth,
                                alias: alias,
                                fullName: `${decodedToken.firstname} ${decodedToken.lastname}`.trim()
                            };
                            const sharedDataUpdated = {...this.sharedDataCurrent, logged: true, userAuth: userAuth};
                            this.store.dispatch(setSharedData({data: sharedDataUpdated}));
                            this.router.navigate([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
                        }
                        this.loader.hide?.();
                    },
                    error: (error: any) => {
                        this.loader.hide?.();
                        this.isErrorFound = true;
                        if (error.status === 401) {
                            this.alertService.error('Invalid credentials', true);
                        }
                        if (error.status === 404) {
                            this.alertService.error('User not found', true);
                        }
                        this.logError(`Error occurred while getting token ${error.statusText}`);
                    },
                    complete: () => {
                        this.loader.hide?.();
                        this.logInfo('Get token completed.');
                    }
                });
        }
    }

    notification(): void {
        this.alertService.getAlert().pipe().subscribe((alert) => {
            if (alert) {
                if (alert.type === 'success') {
                    this._snackBar.openFromComponent(NotifyComponent, {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: (alert.duration * 1000),
                        data: {message: alert.text}
                    });
                } else if (alert.type === 'error' || alert.type === 'warning' || alert.type === 'info') {
                    this.message(alert.text, alert.duration);
                }
            }
        });
    }

    message(message: string, duration: number): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: (duration * 3000)
        });
    }
}

