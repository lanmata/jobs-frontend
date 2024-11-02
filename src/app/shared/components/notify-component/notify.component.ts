import {Component, Inject, inject} from '@angular/core';
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule} from "@angular/common";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef
} from "@angular/material/snack-bar";

@Component({
  selector: 'app-notify-component',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css'
})
export class NotifyComponent {
  protected snackBarRef = inject(MatSnackBarRef);
  message: string = '';
  private readonly data: any

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: any) {
    this.data = data;
    this.message = this.data.message? this.data.message : '';
  }

}
