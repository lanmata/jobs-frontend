import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, Subject} from "rxjs";
import {LoadingService} from "@shared/services/loading.service";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FlexModule} from "@angular/flex-layout";
import {AppState, SharedData} from '@app/state/app.state';
import {Store} from '@ngrx/store';
import {setSharedData} from '@app/state/app.action';
import {AppConst} from "@shared/util/app-const";

let COMPONENT_NAME = 'login.component';

/**
 * LoginComponent is responsible for handling the login functionality.
 * It includes form validation, state management, and navigation.
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
    templateUrl: `${COMPONENT_NAME}.html`,
    styleUrl: `${COMPONENT_NAME}.css`
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
        const sharedDataUpdated = { ...this.sharedDataCurrent, logged: false };
        this.store.dispatch(setSharedData({data: sharedDataUpdated}));
    }

    /**
     * Validates the access credentials entered in the form.
     * If the form is invalid, the method will return early.
     */
    public validateAccess(): void {
        this.submitted = true;

        // Interrupts the method if the form data is invalid
        if (this.loginForm.invalid) {
            this.logError('Invalid form data');
            return;
        }
        this.signin();
    }

    /**
     * Signs in the user by updating the shared data and navigating to the offer path.
     */
    signin() {
        const alias = this.f['alias'].value;
        const userAuth = { alias: alias };
        const updatedSharedData = { ...this.sharedDataCurrent, logged: true, userAuth: userAuth };
        this.store.dispatch(setSharedData({data: updatedSharedData}));
        this.router.navigate([this.appConst.JOBS_NAVIGATOR.OFFER_PATH]).then(nav => {
            console.log(nav); // true if navigation is successful
        }, err => {
            console.log(err); // when there's an error
        });;
    }
}
