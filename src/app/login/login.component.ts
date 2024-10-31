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

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
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

    /**
     * router is an instance of the Router.
     * @private
     */
    private readonly router: Router = inject(Router);

    protected readonly appConst = AppConst;
    
    /** Form builder */
    private readonly formBuilder = inject(FormBuilder);

    sharedData$: Observable<SharedData>;
    sharedDataCurrent: SharedData;

    get f() {
        return this.loginForm.controls;
    }

    submitted = false;

    loading = false;

    loginForm: FormGroup;

    constructor(private store: Store<{ app: AppState }>) {
        this.logInfo = (...arg: any) => console.info(arg);
        this.logError = (...arg: any) => console.error(arg);
        this.loginForm = this.formBuilder.group({
            alias: ["", [Validators.required, Validators.min(5), Validators.max(16)]],
            password: ["", [Validators.required, Validators.min(8), Validators.max(20)]],
            remember: []
        });
        this.sharedDataCurrent = new SharedData();
        this.sharedData$ = store.select(state => state.app.sharedData);
    }

    ngAfterViewInit(): void {
        this.changeDetectorRefs.detectChanges();
    }

    ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }

    ngOnInit(): void {
        this.loader.show();
        this.sharedData$.subscribe(data => {
            console.log(data);
            this.sharedDataCurrent = data;
            // this.logged = data;
        });
    }

    public validateAccess(): void {
        this.logInfo("Ingresa!");
        this.logInfo(this.loginForm.value);

        this.submitted = true;

        // interrumpe la continuidad del metodo por datos invalidos
        if (this.loginForm.invalid) {
            return;
        }

    }

    signin() {
        const updatedSharedData = { ...this.sharedDataCurrent, logged: true };
        this.store.dispatch(setSharedData({data: updatedSharedData}));
        this.router.navigate([this.appConst.JOBS_NAVIGATOR.OFFER_PATH]);
    }
}
