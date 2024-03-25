import {Component, inject} from "@angular/core";
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {takeUntil} from "rxjs";
import {CompanyService} from "./company.service";
import {MaterialModule} from "@shared/material/material.module";

/**
 * CompanyComponent is a component that handles the company related operations.
 * It extends from the AbstractComponent.
 *
 * @extends {AbstractComponent}
 */
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent extends AbstractComponent {
  /**
   * Loader is an instance of LoadingService.
   * It is used to handle the loading operations.
   *
   * @type {LoadingService}
   * @public
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * CompanyService is an instance of the CompanyService.
   * It is used to handle the company related operations.
   *
   * @type {CompanyService}
   * @private
   */
  private companyService: CompanyService = inject(CompanyService);

  /**
   * Constructor for the CompanyComponent.
   * It calls the constructor of the parent class.
   */
  constructor() {
    super();
  }

  /**
   * Lifecycle hook that is called after a component's view has been fully initialized.
   * It calls the detectChanges method of the changeDetectorRefs.
   *
   * @override
   */
  ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * It completes the subject$.
   *
   * @override
   */
  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   *
   * @override
   */
  ngOnInit(): void {
    this.listCompanies();
  }

  listCompanies(): void {
    this.loader.show();
    this.companyService.getCompanies(true).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.companyTOCollection;
          this.dataSource = response.companyTOCollection;
        }, error: (errorResponse) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting companies ${errorResponse}`);
        }, complete: () => this.loader.hide()
      });
  }

}
