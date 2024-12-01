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

    /**
     * Loading service
     * @private
     */
    protected loader: LoadingService = inject(LoadingService);
    /**
     * Login service
     * @private
     */
    private readonly loginService = inject(LoginService);
    /**
     * Alert service
     * @private
     */
    private readonly alertService: AlertService = inject(AlertService);
    /**
     * Flag to indicate if an error was found
     * @private
     */
    public isErrorFound = false;
    /**
     * Function to log information
     * @private
     */
    protected logInfo: (...arg: any) => void;
    /**
     * Function to log errors
     * @private
     */
    protected logError: (...arg: any) => void;
    /**
     * Subject to handle component destruction
     * @private
     */
    protected subject$: Subject<void> = new Subject<void>();
    /**
     * Change detector reference
     * @private
     */
    protected changeDetectorRefs = inject(ChangeDetectorRef);
    /**
     * Router instance
     * @private
     */
    private readonly router: Router = inject(Router);
    /**
     * Application constants
     * @private
     */
    protected readonly appConst = AppConst;
    /**
     * Form builder
     * @private
     */
    private readonly formBuilder = inject(FormBuilder);
    /**
     * Jwt pipe
     * @private
     */
    private readonly jwtPipe = inject(JwtPipe);
    /**
     * Shared data observable
     * @private
     */
    sharedData$: Observable<SharedData>;
    /**
     * Current shared data
     * @private
     */
    sharedDataCurrent: SharedData = new SharedData();
    /**
     * Shared data observable
     * @private
     */
    submitted = false;
    /**
     * Shared data observable
     * @private
     */
    loading = false;
    /**
     * Shared data observable
     * @private
     */
    loginForm: FormGroup;
    /**
     * Shared data observable
     * @private
     */
    private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
    /**
     * Horizontal position for the snack bar.
     * @private
     */
    private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    /**
     * Vertical position for the snack bar.
     * @private
     */
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

    /**
     * Lifecycle hook that is called after a component's view has been fully initialized.
     * @throws {Error} Method not implemented.
     */
    ngAfterViewInit(): void {
        this.changeDetectorRefs.detectChanges();
    }

    /**
     * Lifecycle hook that is called when the component is destroyed
     * It completes the subject$ observable to avoid memory leaks.
     */
    ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }

    /**
     * Lifecycle hook that is called when the component is initialized
     * It loads shared data and shows notifications.
     */
    ngOnInit(): void {
        this.loader.show();
        this.loadSharedData();
        this.notification();
        this.loader.hide();
    }

    /**
     * Getter for form controls
     * @returns The form controls
     */
    get loginValid() {
        let aliasValid = this.validate(this.loginForm.controls[this.appConst.COMMONS_FIELDS.ALIAS]);
        let passwordValid = this.validate(this.loginForm.controls[this.appConst.COMMONS_FIELDS.PASSWORD]);
        const isInvalid = aliasValid.invalid || passwordValid.invalid;

        return {
            alias: aliasValid,
            password: passwordValid,
            invalid: isInvalid
        };
    }

    /**
     * Method to load shared data
     * It subscribes to the shared data observable and updates the shared data in the store.
     * It also sets the logged flag to false.
     * @private
     */
    private loadSharedData() {
        this.sharedData$.subscribe(data => {
            this.sharedDataCurrent = data;
        });
        const sharedDataUpdated = {...this.sharedDataCurrent, logged: false};
        this.store.dispatch(setSharedData({data: sharedDataUpdated}));
    }

    /**
     * Method to validate form controls
     * @param control - The form control to validate
     * @returns The validation result
     * @private
     */
    private validate(control: any): any {
        let deep = {
            required: false,
            minlength: false,
            maxlength: false,
            invalid: false
        };
        if (control?.errors) {
            if (control.errors[this.appConst.COMMONS_FIELDS.REQUIRED]) {
                deep.required = control.errors[this.appConst.COMMONS_FIELDS.REQUIRED];
            }
            if (control.errors[this.appConst.COMMONS_FIELDS.MINLENGTH]) {
                deep.minlength = control.errors[this.appConst.COMMONS_FIELDS.MINLENGTH];
            }
            if (control.errors[this.appConst.COMMONS_FIELDS.MAXLENGTH]) {
                deep.maxlength = control.errors[this.appConst.COMMONS_FIELDS.MAXLENGTH];
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
     * If the form is valid, the method will call the signIn method.
     * @public
     * @returns void
     * @throws {Error} Invalid form data
     * @throws {Error} Error occurred while getting token
     * @throws {Error} Invalid credentials
     * @throws {Error} User not found
     */
    public validateAccess(): void {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.signIn();
        } else {
            this.isErrorFound = true;
            this.logError('Invalid form data');
        }
    }

    /**
     * Signs in the user by updating the shared data and navigating to the offer path.
     * If the login form is valid, the method will call the getToken method of the login service.
     * If the login form is invalid, the method will return early.
     * @public
     * @returns void
     * @throws {Error} Error occurred while getting token
     * @throws {Error} Invalid credentials
     * @throws {Error} User not found
     */
    signIn(): void {
        this.loader.show();
        if (this.loginForm.valid) {
            const alias = this.loginForm.controls[this.appConst.COMMONS_FIELDS.ALIAS].value;
            const password = this.loginForm.controls[this.appConst.COMMONS_FIELDS.PASSWORD].value;
            let userAuth = new UserAuth();

            this.loginService.getToken(alias, password).pipe(takeUntil(this.subject$))
                .subscribe({
                    next: (response: any) => {
                        this.loader.hide?.();
                        // Use the sessionTokenBkd
                        if (response.sessionTokenBkd) {
                            console.log('Session Token BKD:', response.sessionTokenBkd);
                        }
                        const decodedToken =this.jwtPipe.transform(response.sessionTokenBkd);
                        if(decodedToken) {
                            userAuth = {
                                ...userAuth,
                                alias: alias,
                                fullName: `${decodedToken.firstname} ${decodedToken.lastname}`.trim(),
                                sessionTokenBkd: response.sessionTokenBkd,
                                sessionToken: response.body.token
                            };
                            const sharedDataUpdated = {...this.sharedDataCurrent, logged: true, userAuth: userAuth};
                            this.store.dispatch(setSharedData({data: sharedDataUpdated}));
                            this.router.navigate([this.appConst.JOBS_NAVIGATOR.OFFER_PATH]);
                        }
                        this.loader.hide?.();
                    },
                    error: (error: any) => {
                        this.loader.hide?.();
                        this.isErrorFound = true;
                        if (error.status === this.appConst.STATUS_CODE.UNAUTHORIZED) {
                            this.alertService.error('Invalid credentials', true);
                        }
                        if (error.status === this.appConst.STATUS_CODE.NOT_FOUND) {
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

    /**
     * Shows a notification in the snack bar.
     * It subscribes to the alert service and shows a notification in the snack bar based on the alert type.
     * @public
     * @returns void
     * @throws {Error} Invalid alert type
     * @throws {Error} Invalid alert text
     * @throws {Error} Invalid alert duration
     * @throws {Error} Invalid alert
     */
    notification(): void {
        this.alertService.getAlert().pipe().subscribe((alert) => {
            if (alert) {
                if (alert.type === this.appConst.STATUS_CODE.SUCCESS.message[0] || alert.type === this.appConst.STATUS_CODE.SUCCESS.message[1]) {
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

    /**
     * Shows a message in the snack bar.
     * @public
     * @param message
     * @param duration
     * @returns void
     * @throws {Error} Invalid message
     * @throws {Error} Invalid duration
     * @throws {Error} Invalid snack bar
     */
    message(message: string, duration: number): void {
        this._snackBar.open(message, '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: (duration * 3000)
        });
    }
}

