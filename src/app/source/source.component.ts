import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {SourceService} from "./source.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-source',
  standalone: true,
  imports: [],
  templateUrl: './source.component.html',
  styleUrl: './source.component.css'
})
export class SourceComponent extends AbstractComponent {
  /**
   * @type {LoadingService}
   * @memberof SourceComponent
   * @description Loading service
   * @private
   * @default inject(LoadingService)
   * @since 1.0.0
   * @version 1.0.0
   * @see LoadingService
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * @type {SourceService}
   * @memberof SourceComponent
   * @description Source service
   * @private
   * @default inject(SourceService)
   * @since 1.0.0
   * @version 1.0.0
   * @see SourceService
   */
  private sourceService: SourceService = inject(SourceService);

  /**
   * @constructor
   * @memberof SourceComponent
   * @description Constructor for the SourceComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  constructor() {
    super();
  }

  /**
   * @method
   * @memberof SourceComponent
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
   * @memberof SourceComponent
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
   * @memberof SourceComponent
   * @description Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * It calls the getSources method.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngOnInit(): void {
    this.getSources(true);
  }

  /**
   * Get the list of sources.
   * It calls the source service to get the list of sources.
   *
   * @method
   * @memberof SourceComponent
   * @description Get sources
   * @param includeActive - A boolean value to determine whether to include active sources.
   * @since 1.0.0
   * @version 1.0.0
   */
  private getSources(includeActive: boolean): void {
    this.sourceService.getSources(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.sourceTOList;
          this.dataSource = response.sourceTOList;
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting sources ${error}`);
        }, complete: () => {
          this.loader.hide();
        }
      });
  }

}
