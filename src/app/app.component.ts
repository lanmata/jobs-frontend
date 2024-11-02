import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {CommonModule, DatePipe} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";
import {Store} from '@ngrx/store';
import {AppState, SharedData} from './state/app.state';
import {Observable} from 'rxjs';
import {AppConst} from '@shared/util/app-const';

@Component({
    imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
    providers: [DatePipe],
    selector: 'app-root',
    standalone: true,
    styleUrl: './app.component.scss',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    sharedData$: Observable<SharedData>;
    sharedDataCurrent: SharedData = new SharedData();
    /** router is an instance of the Router. */
    protected readonly router: Router = inject(Router);
    /**
     * AppConst is an instance of the AppConst.
     * It is used to access the constants.
     * @type {AppConst}
     * @memberof StoreComponent
     * @description AppConst
     * @public
     * @since 1.0.0
     * @version 1.0.0
     * @see AppConst
     */
    protected readonly appConst = AppConst;

    /** Function to log information */
    protected logInfo: (...arg: any) => void;

    /** Function to log errors */
    protected logError: (...arg: any) => void;

    private readonly store: Store<{ app: AppState }>

    constructor(store: Store<{ app: AppState }>) {
        this.logInfo = (...arg: any) => console.info(arg);
        this.logError = (...arg: any) => console.error(arg);
        this.store = store;
        this.sharedData$ = this.store.select(state => state.app.sharedData);
    }

    ngOnInit(): void {
        this.sharedData$.subscribe(data => {
            this.sharedDataCurrent = data;
            this.logged = this.sharedDataCurrent.logged;
            if(!this.logged) {
                this.router.navigate([this.appConst.JOBS_NAVIGATOR.LOGIN_PATH]);
            }
        });
    }

    title = 'jobs-frontend';
    logged: boolean = false;
}
