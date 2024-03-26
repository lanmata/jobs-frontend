import {Component, inject} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {TermService} from "./term.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-term',
  standalone: true,
  imports: [],
  templateUrl: './term.component.html',
  styleUrl: './term.component.css'
})
export class TermComponent extends AbstractComponent {
  /**
   * @type {LoadingService}
   * @memberof TermComponent
   * @description Loading service
   * @private
   * @default inject(LoadingService)
   * @since 1.0.0
   * @version 1.0.0
   * @see LoadingService
   */
  public loader: LoadingService = inject(LoadingService);

  /**
   * @type {TermService}
   * @memberof TermComponent
   * @description Source service
   * @private
   * @default inject(TermService)
   * @since 1.0.0
   * @version 1.0.0
   * @see TermService
   */
  private termService: TermService = inject(TermService);

  /**
   * @constructor
   * @memberof TermComponent
   * @description Constructor for the TermComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  constructor() {
    super();
  }

  /**
   * @method
   * @memberof TermComponent
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
   * @memberof TermComponent
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
   * @memberof TermComponent
   * @description Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * It calls the getTerm method.
   * @override
   * @since 1.0.0
   * @version 1.0.0
   */
  ngOnInit(): void {
    this.getTerm(true);
  }

  /**
   * Get the list of term.
   * It calls the term service to get the list of term.
   *
   * @method
   * @memberof TermComponent
   * @description Get term
   * @param includeActive - A boolean value to determine whether to include active term.
   * @since 1.0.0
   * @version 1.0.0
   */
  private getTerm(includeActive: boolean): void {
    this.termService.getTerm(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => {
          this.allData = response.termTOCollection;
          this.dataSource = response.termTOCollection;
        },
        error: (error: any) => {
          this.isErrorFound = true;
          this.logError(`Error occurred while getting term ${error}`);
        }, complete: () => {
          this.loader.hide();
        }
      });
  }

}
