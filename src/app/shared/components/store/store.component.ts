import {inject, Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AppState, SharedData} from "@app/state/app.state";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {AppConst} from '@app/shared/util/app-const';

@Injectable()
export abstract class StoreComponent implements OnInit {

    /** Observable for shared data */
    sharedData$: Observable<SharedData> = new Observable<SharedData>();

    /** Current shared data */
    sharedDataCurrent: SharedData = new SharedData();

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
    readonly appConst = AppConst;

    /** router is an instance of the Router. */
    protected readonly router: Router = inject(Router);

    protected constructor(protected readonly store: Store<{ app: AppState }>) {
        if (store) {
            this.sharedData$ = this.store.select(state => state.app.sharedData);
        }
    }

    ngOnInit(): void {
        let isAuthenticated = false;
        if (this.sharedData$) {
            this.sharedData$.subscribe(data => {
                this.sharedDataCurrent = data;
            });
            isAuthenticated = this.sharedDataCurrent.logged;
        }
        if (!isAuthenticated) {
            this.router.navigate([this.appConst.JOBS_NAVIGATOR.LOGIN_PATH]);
        }
    }

}
