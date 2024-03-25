import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {PositionService} from "./position.service";
import {LoadingService} from "@shared/services/loading.service";
import {takeUntil} from "rxjs";
import {MaterialModule} from "@shared/material/material.module";

@Component({
  selector: 'app-position',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './position.component.html',
  styleUrl: './position.component.css'
})
export class PositionComponent extends AbstractComponent {
  /**
   * @type {LoadingService}
   * @memberof ModeComponent
   * @description Loading service
   * @private
   * @default inject(LoadingService)
   * @since 1.0.0
   * @version 1.0.0
   * @see LoadingService
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * @type {PositionService}
   * @memberof ModeComponent
   * @description Mode service
   * @private
   * @default inject(PositionService)
   * @since 1.0.0
   * @version 1.0.0
   * @see PositionService
   */
  private positionService: PositionService = inject(PositionService);

  /**
   * @constructor
   * @memberof ModeComponent
   * @description Constructor for the ModeComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  constructor() {
    super();
  }

  /**
   * @method
   * @memberof ModeComponent
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
   * @memberof ModeComponent
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
   * @memberof PositionComponent
   * @description Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * It calls the getPositions method.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngOnInit(): void {
    this.getPositions(true);
  }

  /**
   * Get the list of positions.
   * It calls the position service to get the list of positions.
   *
   * @method
   * @memberof PositionComponent
   * @description Get positions
   * @param includeActive - A boolean value to determine whether to include active positions.
   * @since 1.0.0
   * @version 1.0.0
   */
  private getPositions(includeActive: boolean): void {
    this.positionService.getPositions(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.positionTOCollection;
          this.dataSource = response.positionTOCollection;
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting positions ${error}`);
        }, complete: () => {
          this.loader.hide();
        }
      });
  }

}
