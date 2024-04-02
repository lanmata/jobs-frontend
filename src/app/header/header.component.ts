import {Component, inject} from '@angular/core';
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
export class HeaderComponent {
  readonly appConst = AppConst;
  private alertService: AlertService = inject(AlertService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor() {
    this.alertService.getAlert().pipe().subscribe((alert) => {
      if (alert) {
        switch (alert.type) {
          case 'success':
            this._snackBar.openFromComponent(NotifyComponent, {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: (alert.duration * 1000),
              data: {message: alert.text}
            });
            break;
          case 'error':
            this._snackBar.open(alert.text, '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: (alert.duration * 1000)
            });
            break;
          case 'warning':
            this._snackBar.open(alert.text, '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: (alert.duration * 1000)
            });
            break;
          case 'info':
            this._snackBar.open(alert.text, '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: (alert.duration * 1000)
            });
            break;
          default:
        }
      }
    });
  }

}
