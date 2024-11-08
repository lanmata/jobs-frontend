import {Component, inject, ViewChild} from '@angular/core';
import {OfferService} from "../offer.service";
import {AbstractComponent} from "@shared/components/abstract-component";
import {takeUntil} from "rxjs";
import {OfferEdit, OfferUpdateRequest} from "../offer.model";
import {LoadingService} from "@shared/services/loading.service";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {MaterialModule} from "@shared/material/material.module";
import {CommonModule, DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {StatusService} from "@app/status/status.service";
import {StatusCollection} from "@app/status/status.model";
import {AlertService} from "@shared/services/alert.service";
import {FormatUtil} from "@shared/util/format.util";
import {OfferDetailService} from "@app/offer-detail/offer-detail.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {OfferDetailConfirmDialogComponent} from "../offer-detail-confirm-dialog/offer-detail-confirm-dialog.component";

/**
 * Component for editing an offer.
 * Extends the AbstractComponent to inherit common functionality.
 */
@Component({
    selector: 'app-edit-offer',
    standalone: true,
    imports: [CommonModule, MaterialModule, TranslateModule, ReactiveFormsModule, FlexModule, RouterLinkActive, RouterLink],
    templateUrl: 'edit-offer.component.html',
    styleUrl: 'edit-offer.component.css'
})
export class EditOfferComponent extends AbstractComponent {

    /** The ID of the job offer being edited. */
    jobOfferId: string = '';
    /** Dialog service for opening dialogs. */
    private readonly dialog: MatDialog = inject(MatDialog);
    /** Activated route service for accessing route parameters. */
    private readonly activatedRoute = inject(ActivatedRoute);
    /** Service for handling offer details. */
    private readonly offerDetailService: OfferDetailService = inject(OfferDetailService);
    /** Service for handling statuses. */
    private readonly statusService: StatusService = inject(StatusService);
    /** Service for showing loading indicators. */
    protected loader: LoadingService = inject(LoadingService);
    /** Service for handling offers. */
    private readonly offerService: OfferService = inject(OfferService);
    /** Form builder service for creating forms. */
    private readonly formBuilder = inject(FormBuilder);
    /** Service for showing alerts. */
    private readonly alertService: AlertService = inject(AlertService);
    /** Date pipe for formatting dates. */
    private readonly datePipe = inject(DatePipe);
    /** Utility for formatting data. */
    private formatUtil!: FormatUtil;
    /** The offer being edited. */
    offer!: OfferEdit;
    /** Collection of statuses. */
    protected readonly statusCollection: StatusCollection = new StatusCollection();
    /** Minimum date for the calendar range. */
    protected minDate!: Date;
    /** Maximum date for the calendar range. */
    protected maxDate!: Date;

    /** Paginator for the material table. */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Sorter for the material table. */
    @ViewChild(MatSort) sort!: MatSort;
    /** Form group for editing the offer. */
    editOfferForm: FormGroup;
    /** Form group for the confirmation dialog. */
    dialogConfirm: FormGroup;
    /** Columns to be displayed in the table. */
    readonly displayedColumns: Iterable<string> = ['datetime', 'description', 'status', 'delete'];

    /**
     * Constructor for the EditOfferComponent.
     */
    constructor() {
        super();
        this.editOfferForm = this.formBuilder.group({
            status: ['', [Validators.required]],
            updateDate: ['', [Validators.required]],
            comments: ['', [Validators.required]]
        });
        this.dialogConfirm = this.formBuilder.group({});
    }

    /**
     * Lifecycle hook that is called after the component's view has been fully initialized.
     */
    override ngAfterViewInit(): void {
        this.changeDetectorRefs.detectChanges();
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     */
    override ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }

    /**
     * Lifecycle hook that is called when the component is initialized.
     */
    override ngOnInit(): void {
        this.logInfo('Initializing EditOfferComponent');
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

    /**
     * Updates the offer with the values from the form.
     */
    updateOffer() {
        this.loader.show();
        const offerUpdateRequest = new OfferUpdateRequest();
        offerUpdateRequest.statusId = this.editOfferForm.get('status')?.value;
        offerUpdateRequest.description = this.editOfferForm.get('comments')?.value;
        offerUpdateRequest.createdDateTime = this.formatUtil.datetimeStandard(this.editOfferForm.get('updateDate')?.value);
        this.logInfo('this.formatUtil:', this.formatUtil);
        this.logInfo('this.formatUtil.datetimeStandard:', this.formatUtil.datetimeStandard);

        this.offerService.putOffer(this.jobOfferId, offerUpdateRequest).pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => {
                    this.loadOffer();
                    this.cleanValues();
                    this.alertService.success(`Updated offer #${response.id} successfully`, true);
                },
                error: (errorResponse: any) => {
                    this.logError('Error updating offer:', errorResponse);
                    this.alertService.success('We have an error processing the request.', true);
                    this.loader.hide();
                },
                complete: () => {
                    this.loader.hide();
                }
            });
    }

    /**
     * Opens a confirmation dialog for deleting an offer detail.
     * @param offerDetailId The ID of the offer detail to be deleted.
     */
    openDialogConfirm(offerDetailId: string) {
        const offerDetailDeleteDialogConfig = new MatDialogConfig();
        offerDetailDeleteDialogConfig.disableClose = true;
        offerDetailDeleteDialogConfig.autoFocus = true;
        offerDetailDeleteDialogConfig.panelClass = "offer-delete";
        offerDetailDeleteDialogConfig.data = offerDetailId;
        this.cleanValues();
        const offerDetailDeleteDialog = this.dialog.open(OfferDetailConfirmDialogComponent, offerDetailDeleteDialogConfig);
        offerDetailDeleteDialog.afterClosed().subscribe(value => {
            if (value) {
                this.deleteOfferDetail(offerDetailId);
            }
        });
    }

    /**
     * Deletes an offer detail.
     * @param offerDetailId The ID of the offer detail to be deleted.
     */
    private deleteOfferDetail(offerDetailId: string) {
        this.loader.show();
        this.offerDetailService.deleteOfferDetail(offerDetailId).pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => {
                    this.loadOffer();
                    this.alertService.success(`Deleted offer detail #${response.id} successfully`, true);
                },
                error: (errorResponse: any) => {
                    this.logError('Error deleting offer detail:', errorResponse);
                    this.alertService.success('We have an error processing the request.', true);
                    this.loader.hide();
                },
                complete: () => {
                    this.loader.hide();
                }
            });
    }

    /**
     * Loads the offer details.
     */
    private loadOffer(): void {
        if (this.jobOfferId !== undefined) {
            this.offerService.getOffer(this.jobOfferId).pipe(takeUntil(this.subject$))
                .subscribe({
                    next: (response: any) => {
                        this.offer = response;
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
     * Gets the list of statuses.
     * @param includeActive A boolean value to determine whether to include active statuses.
     */
    private listStatus(includeActive: boolean): void {
        this.statusService.getStatus(includeActive).pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => this.statusCollection.statuses = response.list,
                error: (error: any) => this.setErrorFound('statuses', error),
                complete: () => {
                    this.logInfo(`Get statuses completed. ${this.statusCollection.statuses.length} statuses found`);
                }
            });
    }

    /**
     * Sets the status for each post detail in the offer.
     */
    private setStatus(): void {
        if (this.offer.postDetailList && this.statusCollection?.statuses) {
            this.offer.postDetailList.forEach((postDetail) => {
                const matchingStatus = this.statusCollection.statuses.find(status => status.id === postDetail.statusId);
                if (matchingStatus) {
                    postDetail.status = matchingStatus.name;
                }
            });
        }
    }

    /**
     * Sets the error found flag and logs the error.
     * @param element The element where the error occurred.
     * @param errorResponse The error response to log.
     */
    private setErrorFound(element: string, errorResponse: Error): void {
        this.isErrorFound = true;
        this.logError(`Error occurred while getting ${element} ${errorResponse}`);
    }

    /**
     * Sets the calendar range for the offer.
     */
    private setCalendarRange() {
        this.minDate = new Date(this.offer.postDetailList[0].datetime);
        this.maxDate = new Date();
    }

    /**
     * Resets the form values.
     */
    cleanValues() {
        this.editOfferForm.controls['status'].reset();
        this.editOfferForm.controls['status'].markAsPending({onlySelf: true});
        this.editOfferForm.controls['updateDate'].reset();
        this.editOfferForm.controls['updateDate'].markAsPending({onlySelf: true});
        this.editOfferForm.controls['comments'].reset();
        this.editOfferForm.controls['comments'].markAsPending({onlySelf: true});
    }

    /**
     * Logs a message indicating that the implementation is pending.
     */
    onNoClick() {
        this.logInfo('Implement pending ');
    }
}