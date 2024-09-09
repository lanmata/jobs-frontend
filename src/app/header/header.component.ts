import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from "@angular/router";
import {AppConst} from "@shared/util/app-const";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {AlertService} from '@shared/services/alert.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {NotifyComponent} from "@shared/components/notify-component/notify.component";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule, FormsModule, TranslateModule, NotifyComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
    readonly appConst = AppConst;
    private alertService: AlertService = inject(AlertService);
    private _snackBar: MatSnackBar = inject(MatSnackBar);
    private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor() {
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
        this.notification();
    }

}
