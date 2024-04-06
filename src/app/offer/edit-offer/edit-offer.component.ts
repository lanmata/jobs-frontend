import {Component, inject, ViewChild} from '@angular/core';
import {OfferService} from "../offer.service";
import {AbstractComponent} from "@shared/components/abstract-component";
import {takeUntil} from "rxjs";
import {OfferEdit, OfferUpdateRequest} from "../offer.model";
import {LoadingService} from "@shared/services/loading.service";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule, DatePipe} from "@angular/common";
import {AppConst} from "@shared/util/app-const";
import {TranslateModule} from "@ngx-translate/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {StatusService} from "../../status/status.service";
import {StatusCollection} from "../../status/status.model";
import {AlertService} from "@shared/services/alert.service";
import {FormatUtil} from "@shared/util/format-util";

@Component({
  selector: 'app-edit-offer',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule, ReactiveFormsModule, FlexModule, RouterLinkActive, RouterLink],
  templateUrl: './edit-offer.component.html',
  styleUrl: './edit-offer.component.css'
})
export class EditOfferComponent extends AbstractComponent {

  jobOfferId: string = '';
  private activatedRoute = inject(ActivatedRoute);
  private offerService: OfferService = inject(OfferService);
  private statusService: StatusService = inject(StatusService);
  private alertService: AlertService = inject(AlertService);
  private formBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private formatUtil!: FormatUtil;
  private datePipe = inject(DatePipe);
  protected loader: LoadingService = inject(LoadingService);
  offer!: OfferEdit;
  protected readonly statusCollection: StatusCollection = new StatusCollection();
  protected readonly appConst = AppConst;
  protected minDate!: Date;
  protected maxDate!: Date

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  editOfferForm: FormGroup;
  /**
   * dataSource is an array of offers.
   */
  readonly displayedColumns: Iterable<string> = ['datetime', 'description', 'status'];

  constructor() {
    super();
    this.editOfferForm = this.formBuilder.group({
      status: ['', [Validators.required]],
      updateDate: ['', [Validators.required]],
      comments: ['', [Validators.required]]
    });
  }

  override ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

  override ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  override ngOnInit(): void {
    this.loader.show();
    this.formatUtil = new FormatUtil(this.datePipe);
    this.offer = new OfferEdit();
    this.offer.postDetailList = [{
      datetime: new Date(),
      id: '',
      description: '',
      mountRate: 0,
      jobOfferId: '',
      statusId: '',
      status: ''
    }];
    this.jobOfferId = this.activatedRoute.snapshot.params['offerId'];
    this.listStatus(false);
    this.loadOffer();
  }

  updateOffer() {
    this.loader.show();
    const offerUpdateRequest = new OfferUpdateRequest();
    offerUpdateRequest.statusId = this.editOfferForm.get('status')?.value;
    offerUpdateRequest.description = this.editOfferForm.get('comments')?.value;
    offerUpdateRequest.createdDateTime = this.formatUtil.datetimeStandard(this.editOfferForm.get('updateDate')?.value);

    this.offerService.putOffer(this.jobOfferId, offerUpdateRequest).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.loadOffer();
          this.cleanValues();
          this.alertService.success(`Updated  offer #${response.id} successfully`, true);
        },
        error: (errorResponse: any) => {
          this.logError('Error updating offer:', errorResponse)
          this.alertService.success('We have a error to process the request.', true);
          this.loader.hide();
        },
        complete: () => {
          this.loader.hide();
        }
      });
  }

  private loadOffer(): void {
    if (this.jobOfferId !== undefined) {
      this.offerService.getOffer(this.jobOfferId).pipe(takeUntil(this.subject$))
        .subscribe({
          next: (response: any) => {
            this.offer = response
            this.setCalendarRange();
            this.setStatus();
            this.dataProcess(this.offer.postDetailList, this.sort, this.paginator);
          },
          error: (errorResponse: any) => this.logError('Error loading offer:', errorResponse),
          complete: () => {
            this.loader.hide();
          }
        });
    }
  }

  /**
   * Get the list of statuses.
   * It calls the status service to get the list of statuses.
   *
   * @method
   * @memberof StatusComponent
   * @description Get statuses
   * @param includeActive - A boolean value to determine whether to include active statuses.
   * @since 1.0.0
   * @version 1.0.0
   */
  private listStatus(includeActive: boolean): void {
    this.statusService.getStatus(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.statusCollection.statuses = response.statusTOCollection,
        error: (error: any) => this.setErrorFound('statuses', error),
        complete: () => {
          this.logInfo(`Get statuses completed. ${this.statusCollection.statuses.length} statuses found`);
        }
      });
  }

  private setStatus(): void {
    if (this.offer.postDetailList && this.statusCollection?.statuses) {
      this.offer.postDetailList.forEach((postDetail) => {
        this.statusCollection.statuses.filter((status) => {
          if (status.id === postDetail.statusId) {
            postDetail.status = status.name;
          }
        });
      });
    }
  }

  /**
   * Set the error found.
   * It sets the error found to true and logs the error.
   *
   * @method
   * @memberof NewOfferComponent
   * @param element - The element to set the error found.
   * @param errorResponse - The error response to log.
   * @since 1.0.0
   * @version 1.0.0
   */
  private setErrorFound(element: string, errorResponse: Error): void {
    this.isErrorFound = true;
    this.logError(`Error occurred while getting ${element} ${errorResponse}`);
  }

  private setCalendarRange() {
    this.minDate = new Date(this.offer.postDetailList[0].datetime);
    this.maxDate = new Date();
  }

  cleanValues() {
    this.editOfferForm.controls['status'].reset();
    this.editOfferForm.controls['status'].markAsPending({onlySelf: true});
    this.editOfferForm.controls['updateDate'].reset();
    this.editOfferForm.controls['updateDate'].markAsPending({onlySelf: true});
    this.editOfferForm.controls['comments'].reset();
    this.editOfferForm.controls['comments'].markAsPending({onlySelf: true});
  }
}
