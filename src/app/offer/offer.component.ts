import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {OfferService} from "./offer.service";
import {takeUntil} from "rxjs";
import {MaterialModule} from "@shared/material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingService} from "@shared/services/loading.service";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";
import {AppConst} from "@shared/util/app-const";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ChartComponent} from "../chart/chart.component";
import {Offer, OfferItem} from "./offer.model";

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
  imports: [MaterialModule, MatSortModule, TranslateModule, AsyncPipe, FormsModule, RouterLink, RouterLinkActive, ChartComponent],
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
  readonly displayedColumns: Iterable<string> = ['select', 'id', 'position', 'company', 'updated_at', 'source', 'status', 'edit', 'delete'];

  /**
   * offerService is a private instance of the OfferService.
   */
  private offerService: OfferService = inject(OfferService);

  private router: Router = inject(Router);

  protected readonly appConst = AppConst;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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
        next: (response: any) => this.dataProcess(this.dataFormatter(response), this.sort, this.paginator),
        error: (errorResponse) => {
          this.isErrorFound = true;
          this.logError('Error occurred while getting offers', errorResponse);
        },
        complete: () => {
          this.logInfo('Get offers completed.');
          this.loader.hide();
        }
      });
  }

  private dataFormatter(data: any): OfferItem[] {
    let offerList: OfferItem[] = [];
    data.forEach((offer: Offer) => {
      let offerItem = new OfferItem();
      offerItem.id = offer.id;
      offerItem.idSmall = `${offer.id.split('-')[0]}...`;
      offerItem.position = offer.position;
      offerItem.company = offer.company;
      offerItem.lastModifiedDate = offer.lastModifiedDate;
      offerItem.source = offer.source;
      offerItem.status = offer.status;
      this.logInfo(offerItem);
      offerList.push(offerItem);
    });
    return offerList;
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
    console.log('Exporting to excel');
  }

  // PENDING - Implement the following methods
  showInactive() {
    console.log('Showing inactive');
    return false;
  }
}