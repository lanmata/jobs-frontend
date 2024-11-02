import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, Subject} from "rxjs";
import {LoadingService} from "@shared/services/loading.service";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FlexModule} from "@angular/flex-layout";
import {AppState, SharedData, UserAuth} from '@app/state/app.state';
import {Store} from '@ngrx/store';
import {setSharedData} from '@app/state/app.action';
import {AppConst} from "@shared/util/app-const";

/**
 * LoginComponent is responsible for handling the login functionality.
 * It includes form validation, state management, and navigation.
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
    templateUrl: 'login.component.html',
    styleUrl: 'login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    /** Loading service */
    protected loader: LoadingService = inject(LoadingService);

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

    /** Observable for shared data */
    sharedData$: Observable<SharedData>;

    /** Current shared data */
    sharedDataCurrent: SharedData = new SharedData();

    /** Getter for form controls */
    get f() {
        return this.loginForm.controls;
    }

    /** Flag to indicate if the form has been submitted */
    submitted = false;

    /** Flag to indicate if loading is in progress */
    loading = false;

    /** Login form group */
    loginForm: FormGroup;

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
    }

    /**
     * Validates the access credentials entered in the form.
     * If the form is invalid, the method will return early.
     */
    public validateAccess(): void {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.router.navigate([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
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
        if (this.loginForm.valid) {
            const alias = this.loginForm.controls['alias'].value;
            const userAuth = new UserAuth();
            userAuth.alias = alias;

            const sharedDataCurrent = new SharedData();
            sharedDataCurrent.logged = true;
            sharedDataCurrent.userAuth = userAuth;

            this.store.dispatch({
                type: '[Shared] Set Data',
                data: sharedDataCurrent
            });

            this.router.navigate([AppConst.JOBS_NAVIGATOR.OFFER_PATH]);
        }
    }
}
