import {CanActivateFn, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {AppState} from "@app/state/app.state";
import {inject} from '@angular/core';
import {AppConst} from '@app/shared/util/app-const';

export const authGuard: CanActivateFn = (route, state) => {
    const appConst = AppConst;
    const store: Store<{ app: AppState }> = inject(Store);
    const sharedData$ = store.select(state => state.app.sharedData);
    const router: Router = inject(Router);
    let isAuthenticated = false;
    if (sharedData$) {
        sharedData$.subscribe(data => {
            isAuthenticated = data.logged;
        });
    } else {
        router.navigate([appConst.JOBS_NAVIGATOR.LOGIN_PATH]);
    }
    return isAuthenticated;
};
