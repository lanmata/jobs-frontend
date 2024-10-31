import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Router, RouterLink} from "@angular/router";
import {AppConst} from "@shared/util/app-const";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {AlertService} from '@shared/services/alert.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {NotifyComponent} from "@shared/components/notify-component/notify.component";
import {Observable} from "rxjs";
import {AppState, SharedData} from "@app/state/app.state";
import {Store} from "@ngrx/store";
import {setSharedData} from "@app/state/app.action";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule, FormsModule, TranslateModule, NotifyComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
    readonly appConst = AppConst;
    private readonly alertService: AlertService = inject(AlertService);
    private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
    private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    private readonly verticalPosition: MatSnackBarVerticalPosition = 'top';

    sharedData$: Observable<SharedData>;
    sharedDataCurrent: SharedData;
    /**
     * router is an instance of the Router.
     * @private
     */
    private readonly router: Router = inject(Router);

    constructor(private store: Store<{ app: AppState }>) {
        this.sharedDataCurrent = new SharedData();
        this.sharedData$ = store.select(state => state.app.sharedData);
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

    ngOnDestroy(): void {
        console.info("header component destroyed");
    }

    ngOnInit(): void {
        this.sharedData$.subscribe(data => {
            console.log("New value ", data);
            this.sharedDataCurrent = data;
        });
        this.notification();
    }

    logout() {
        this.store.dispatch(setSharedData({data: new SharedData()}));
        this.router.navigate([this.appConst.JOBS_NAVIGATOR.LOGIN_PATH]);
    }

}
