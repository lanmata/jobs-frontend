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
import {AppConst} from "@shared/util/app-const";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
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
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent extends AbstractComponent {

  /**
   * dataSource is an array of offers.
   */
  public loader: LoadingService = inject(LoadingService);
  /**
   * dataSource is an array of offers.
   */
  readonly displayedColumns: Iterable<string> = ['select', 'id', 'position', 'company', 'updated_at', 'source', 'status', 'edit', 'add_status', 'delete'];
  /**
   * offerService is a private instance of the OfferService.
   */
  private offerService: OfferService = inject(OfferService);
  /**
   * reportService is a private instance of the ReportService.
   * @private
   */
  private reportService: ReportService = inject(ReportService);
  /**
   * fileSaverService is a private instance of the FileSaverService.
   * @private
   */
  private fileSaverService: FileSaverService = inject(FileSaverService);
  /**
   * router is an instance of the Router.
   * @private
   */
  private router: Router = inject(Router);
  /**
   * datePipe is an instance of the DatePipe.
   * @private
   */
  private datePipe: DatePipe = inject(DatePipe);
  private formatUtil!: FormatUtil;

  protected readonly appConst = AppConst;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private rowSelected: any;


  /**
   * Constructor for the OfferComponent.
   * It calls the constructor of the parent class.
   */
  constructor() {
    super();
  }

  /**
   * ngAfterViewInit is a lifecycle hook that is called after a component's view has been fully initialized.
   * @throws {Error} Method not implemented.
   */
  ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * ngOnDestroy is a lifecycle hook that is called once the component is about to be destroyed.
   * It completes the subject$ observable to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  /**
   * ngOnInit is a lifecycle hook that is called once the component has been initialized.
   * It calls the getOffers method to fetch the offers.
   */
  ngOnInit(): void {
    this.loader.show();
    this.formatUtil = new FormatUtil(this.datePipe);
    this.getOffers();
  }

  /**
   * getOffers is a private method that fetches the offers from the OfferService.
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

  editJobOffer(element: any): void {
    this.router.navigate([this.appConst.JOBS_NAVIGATOR.EDIT_OFFER_PATH, {offerId: element.id}]);
  }

  // PENDING - Implement the following methods
  addStatus(element: any) {
    console.log('Adding status', element);
  }

  // PENDING - Implement the following methods
  deleteJobOffer(element: any) {
    console.log('Deleting job offer', element);
  }

  // PENDING - Implement the following methods
  create() {
    console.log('Creating job offer');
  }

  // PENDING - Implement the following methods
  exportToExcel() {
    const now = new Date();
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
              // const dateFormated = this.formatUtil.dateTimeFileFormatter(`${now.toDateString()} ${now.toTimeString()}`);
              // let blob = new Blob([response.body], {type: 'application/octet-stream'});
              // this.fileSaverService.save(blob, filename);
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
            }
          }
      );
      // )
      // ((response: any) => {
      //   if (response) {
      //     const dateFormated = this.formatUtil.dateTimeFileFormatter(`${now.toDateString()} ${now.toTimeString()}`);
      //     let blob = new Blob([response], {type: 'application/octet-stream'});
      //     this.fileSaverService.save(blob, `job-offers-report-${dateFormated}.xlsx`);
      //   }
      // });
    }
    console.log('Exporting to excel');
  }

  // PENDING - Implement the following methods
  showInactive() {
    console.log('Showing inactive');
    return false;
  }

  isSelected(row: any): boolean {
    return this.rowSelected === row;
  }

  rowSelect(row: any): void {
    console.log('Row selected', row);
    this.rowSelected = row;
  }
}
