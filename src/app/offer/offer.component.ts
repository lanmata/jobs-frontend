import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {OfferService} from "./offer.service";
import {Observable, takeUntil} from "rxjs";
import {MaterialModule} from "@shared/material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingService} from "@shared/services/loading.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ReportService} from "@shared/services/report.service";
import {FormatUtil} from "@shared/util/format.util";
import {AppState, SharedData} from "@app/state/app.state";
import {Store} from "@ngrx/store";
import {saveAs} from "file-saver";
import {HttpResponse} from "@angular/common/http";

/**
 * OfferComponent is a component that handles the offers in the application.
 * It extends the AbstractComponent.
 *
 * @selector 'app-offer'
 * @standalone true
 * @imports []
 * @templateUrl './offer.component.html'
 * @styleUrl './offer.component.css'
 */
@Component({
    selector: 'app-offer',
    standalone: true,
    imports: [MaterialModule, MatSortModule, TranslateModule, AsyncPipe, FormsModule, RouterLink, RouterLinkActive],
    templateUrl: 'offer.component.html',
    styleUrl: 'offer.component.css'
})
export class OfferComponent extends AbstractComponent {

    /**
     * Loader service for showing loading indicators.
     */
    public loader: LoadingService = inject(LoadingService);
    /**
     * Columns to be displayed in the table.
     */
    readonly displayedColumns: Iterable<string> = ['select', 'id', 'position', 'company', 'updated_at', 'source', 'status', 'edit', 'add_status', 'delete'];
    /**
     * Service for handling offers.
     */
    private readonly offerService: OfferService = inject(OfferService);
    /**
     * Service for generating reports.
     */
    private readonly reportService: ReportService = inject(ReportService);
    /**
     * Date pipe for formatting dates.
     */
    private readonly datePipe: DatePipe = inject(DatePipe);
    /**
     * Utility for formatting data.
     */
    private formatUtil!: FormatUtil;

    /**
     * Paginator for the material table.
     */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /**
     * Sorter for the material table.
     */
    @ViewChild(MatSort) sort!: MatSort;

    /**
     * Selected row in the table.
     */
    private rowSelected: any;

    /** Observable for shared data */
    sharedData$: Observable<SharedData>;

    /** Current shared data */
    sharedDataCurrent: SharedData = new SharedData();

    /**
     * Constructor for the OfferComponent.
     * It calls the constructor of the parent class.
     */
    constructor(private readonly store: Store<{ app: AppState }>) {
        super();
        this.sharedData$ = store.select(state => state.app.sharedData);
        this.sharedData$.pipe(takeUntil(this.subject$)).subscribe(data => {
            this.sharedDataCurrent = data;
        });
    }

    /**
     * Lifecycle hook that is called after a component's view has been fully initialized.
     * @throws {Error} Method not implemented.
     */
    ngAfterViewInit(): void {
        this.changeDetectorRefs.detectChanges();
    }

    /**
     * Lifecycle hook that is called once the component is about to be destroyed.
     * It completes the subject$ observable to avoid memory leaks.
     */
    ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }

    /**
     * Lifecycle hook that is called once the component has been initialized.
     * It calls the getOffers method to fetch the offers.
     */
    ngOnInit(): void {
        this.logInfo('Offer component initialized.');
        this.loader.show();
        this.formatUtil = new FormatUtil(this.datePipe);
        this.getOffers();
    }

    /**
     * Fetches the offers from the OfferService.
     * It subscribes to the getOffers method of the OfferService and updates the component's data source.
     * If an error occurs while fetching the offers, it logs the error.
     */
    private getOffers(): void {
        this.offerService.getOffers(this.sharedDataCurrent.userAuth.sessionTokenBkd).pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => this.dataProcess(response.list, this.sort, this.paginator),
                error: (errorResponse) => {
                    this.isErrorFound = true;
                    this.logError('Error occurred while getting offers', errorResponse);
                    this.loader.hide();
                },
                complete: () => {
                    this.logInfo('Get offers completed.');
                    this.loader.hide();
                }
            });
    }

    /**
     * Navigates to the edit offer page.
     * @param element The offer element to be edited.
     */
    editJobOffer(element: any): void {
        this.logInfo('Editing job offer', element);
        this.router.navigate([this.appConst.JOBS_NAVIGATOR.EDIT_OFFER_PATH, {offerId: element.id}]);
    }

    /**
     * Adds a status to the offer.
     * @param element The offer element to add a status to.
     */
    addStatus(element: any) {
        console.log('Adding status', element);
    }

    /**
     * Deletes a job offer.
     * @param element The offer element to be deleted.
     */
    deleteJobOffer(element: any) {
        console.log('Deleting job offer', element);
    }

    /**
     * Creates a new job offer.
     */
    create() {
        console.log('Creating job offer');
    }

    /**
     * Exports the job offers to an Excel file.
     */
    exportToExcel() {
        const t = new Date();
        t.setMonth(t.getMonth() - 3);
        const startDate = this.formatUtil.dateFormatter(t.toDateString());
        const endDate = this.formatUtil.dateFormatter(new Date().toDateString());
        if (startDate && endDate) {

            this.reportService.getReports(startDate, endDate).pipe(takeUntil(this.subject$))
                .subscribe(
                    (response) => {
                        if (response && response.body) {
                                const base64Content = response.body.content;
                                const decodedContent = atob(base64Content);
                                const byteArray = new Uint8Array(decodedContent.split('').map(char => char.charCodeAt(0)));
                                const blob = new Blob([byteArray], { type: 'application/octet-stream' });
                                const filename = this.getFilename(response, { filename: 'job_offers', extension: 'xlsx' });
                                saveAs(blob, filename);
                        }
                    }
                );
        }
    }

    /**
     * Downloads a file from a response.
     * @param response The response containing the file.
     * @param options Options for downloading the file.
     */
    private getFilename(response: any, options: DownloadOptions): string {
        let filename = options.filename || 'file';
        const header = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=(([‘"]).*?\2|[^;\n]*)/;
        if (header) {
            const matches = filenameRegex.exec(header);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/[‘"]/g, '');
            }
        }

        return filename;
    }

    /**
     * Shows inactive job offers.
     * @returns {boolean} False indicating the method is not implemented.
     */
    showInactive(): boolean {
        console.log('Showing inactive');
        return false;
    }

    /**
     * Checks if a row is selected.
     * @param row The row to check.
     * @returns {boolean} True if the row is selected, false otherwise.
     */
    isSelected(row: any): boolean {
        return this.rowSelected === row;
    }

    /**
     * Selects a row in the table.
     * @param row The row to select.
     */
    rowSelect(row: any): void {
        console.log('Row selected', row);
        this.rowSelected = row;
    }
}

interface DownloadOptions {
    filename?: string;
    extension?: string;
}