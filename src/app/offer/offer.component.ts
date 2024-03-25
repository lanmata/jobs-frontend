import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {OfferService} from "./offer.service";
import {takeUntil} from "rxjs";
import {MaterialModule} from "@shared/material/material.module";

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
  imports: [MaterialModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent extends AbstractComponent {

  /**
   * offerService is a private instance of the OfferService.
   */
  private offerService: OfferService = inject(OfferService);

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
    this.getOffers();
  }

  /**
   * getOffers is a private method that fetches the offers from the OfferService.
   * It subscribes to the getOffers method of the OfferService and updates the component's data source.
   * If an error occurs while fetching the offers, it logs the error.
   */
  private getOffers(): void {
    this.offerService.getOffers().pipe(takeUntil(this.subject$)).subscribe({
      next: (response: any) => {
        if (null !== response) {
          this.allData = response;
          this.dataSource = response;
          this.dataSource = response;
        }
      }, error: (errorResponse) => {
        this.isErrorFound = true;
        this.logError('Error occurred while getting offers', errorResponse);
      }
    });
  }
}
