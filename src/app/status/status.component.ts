import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {StatusService} from "./status.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent extends AbstractComponent {
  /**
   * @type {LoadingService}
   * @memberof StatusComponent
   * @description Loading service
   * @private
   * @default inject(LoadingService)
   * @since 1.0.0
   * @version 1.0.0
   * @see LoadingService
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * @type {StatusService}
   * @memberof StatusComponent
   * @description Source service
   * @private
   * @default inject(StatusService)
   * @since 1.0.0
   * @version 1.0.0
   * @see StatusService
   */
  private statusService: StatusService = inject(StatusService);

  /**
   * @constructor
   * @memberof StatusComponent
   * @description Constructor for the StatusComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  constructor() {
    super();
  }

  /**
   * @method
   * @memberof StatusComponent
   * @description Lifecycle hook that is called after a component's view has been fully initialized.
   * It calls the detectChanges method of the changeDetectorRefs.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * @method
   * @memberof StatusComponent
   * @description Lifecycle hook that is called when the component is destroyed.
   * It calls the next and complete methods of the subject$.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  /**
   * @method
   * @memberof StatusComponent
   * @description Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * It calls the getStatus method.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngOnInit(): void {
    this.getStatus(true);
  }

  /**
   * Get the list of status.
   * It calls the status service to get the list of status.
   *
   * @method
   * @memberof StatusComponent
   * @description Get status
   * @param includeActive - A boolean value to determine whether to include active status.
   * @since 1.0.0
   * @version 1.0.0
   */
  private getStatus(includeActive: boolean): void {
    this.statusService.getStatus(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.statusTOCollection;
          this.dataSource = response.statusTOCollection;
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting status ${error}`);
        }, complete: () => {
          this.loader.hide();
        }
      });
  }

}
