import {AfterViewInit, ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-offer-detail-confirm-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule, TranslateModule],
  templateUrl: './offer-detail-confirm-dialog.component.html',
  styleUrl: './offer-detail-confirm-dialog.component.css'
})
export class OfferDetailConfirmDialogComponent implements OnDestroy, AfterViewInit {

  protected offerDetailDialog: FormGroup;

  private formBuilder = inject(FormBuilder);

  public isErrorFound = false;

  protected logInfo: (...arg: any) => void;

  protected logError: (...arg: any) => void;

  protected changeDetectorRefs = inject(ChangeDetectorRef);

  private matDialogRef: MatDialogRef<OfferDetailConfirmDialogComponent> = inject(MatDialogRef<OfferDetailConfirmDialogComponent>);
  private subject$: Subject<void> = new Subject<void>();
  protected offerDetailId: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) offerDetailId: string) {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    this.offerDetailDialog = this.formBuilder.group({});
    this.offerDetailId = offerDetailId;
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  onClick(value: boolean) {
    this.matDialogRef.close(value);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

}
