import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {MaterialModule} from "@shared/material/material.module";
import {LoadingService} from "@shared/services/loading.service";
import {ModeService} from "./mode.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.css'
})
export class ModeComponent extends AbstractComponent {
  /**
   * @type {LoadingService}
   * @memberof ModeComponent
   * @description Loading service
   * @private
   * @default inject(LoadingService)
   * @since 1.0.0
   * @version 1.0.0
   * @see LoadingService
   * @example
   * private loader: LoadingService = inject(LoadingService);
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * @type {ModeService}
   * @memberof ModeComponent
   * @description Mode service
   * @private
   * @default inject(ModeService)
   * @since 1.0.0
   * @version 1.0.0
   * @see ModeService
   */
  private modeService: ModeService = inject(ModeService);

  /**
   * @constructor
   * @memberof ModeComponent
   * @description Constructor for the ModeComponent
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * constructor();
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
  override ngAfterViewInit(): void {
    this.changeDetectorRefs.detectChanges();
  }

  /**
   * @method
   * @memberof ModeComponent
   * @description Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * It completes the subject$.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  override ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }

  /**
   * @method
   * @memberof ModeComponent
   * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  override ngOnInit(): void {
    this.listModes(true);
  }

  /**
   * List the mode.
   * It calls the mode service to get the list of mode.
   *
   * @method
   * @memberof ModeComponent
   * @description List modes
   * @param {boolean} includeInactive
   * @since 1.0.0
   * @version 1.0.0
   */
  private  listModes(includeInactive: boolean): void {
    this.loader.show();
    this.modeService.getModes(includeInactive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.modeTOCollection;
          this.dataSource = response.modeTOCollection;
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting modes ${error}`);
        }, complete: () => {
          this.loader.hide();
        }
      });

  }

}
