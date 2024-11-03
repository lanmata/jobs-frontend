import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {OfferService} from "./offer.service";
import {map, takeUntil} from "rxjs";
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
import {FileSaverService} from "ngx-filesaver";

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
     * Service for saving files.
     */
    private readonly fileSaverService: FileSaverService = inject(FileSaverService);
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

    /**
     * Constructor for the OfferComponent.
     * It calls the constructor of the parent class.
     */
    constructor() {
        super();
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
        this.offerService.getOffers().pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => this.dataProcess(response, this.sort, this.paginator),
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
                .pipe(
                    map(response => {
                        if (response) {
                            const filename = 'job-offers-report.xlsx';
                            return {
                                filename: filename,
                                data: response as Blob
                            };
                        }
                        console.log('No response');
                        return null;
                    })).subscribe(
                (response: any) => {
                    if (response) {
                        let blob = new Blob([response.data], {type: 'application/octet-stream'});
                        this.fileSaverService.save(blob, response.filename);
                        console.log('Exporting to excel');
                    }
                }
            );
        }
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