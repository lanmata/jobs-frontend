import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ModeService} from "../../mode/mode.service";
import {TermService} from "../../term/term.service";
import {PositionService} from "../../position/position.service";
import {CompanyService} from "../../company/company.service";
import {SourceService} from "../../source/source.service";
import {CompanyCollection} from "../../company/company.model";
import {LoadingService} from "@shared/services/loading.service";
import {Subject, takeUntil} from "rxjs";
import {ModeCollection} from "../../mode/mode.model";
import {PositionCollection} from "../../position/position.model";
import {SourceCollection} from 'src/app/source/source.model';
import {TermCollection} from "../../term/term.model";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FormsModule} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-new-offer',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule],
  templateUrl: './new-offer.component.html',
  styleUrl: './new-offer.component.css'
})
export class NewOfferComponent implements OnInit, OnDestroy, AfterViewInit {

  public isErrorFound = false;

  protected logInfo: (...arg: any) => void;

  protected logError: (...arg: any) => void;

  protected changeDetectorRefs = inject(ChangeDetectorRef);

  protected subject$: Subject<void> = new Subject<void>();

  private companyService: CompanyService = inject(CompanyService);

  private modeService: ModeService = inject(ModeService);

  private positionService: PositionService = inject(PositionService);

  private sourceService: SourceService = inject(SourceService);

  private termService: TermService = inject(TermService);

  protected loader: LoadingService = inject(LoadingService);

  readonly companyCollection: CompanyCollection = new CompanyCollection();

  readonly modeCollection: ModeCollection = new ModeCollection();

  readonly positionCollection = new PositionCollection();

  readonly sourceCollection: SourceCollection = new SourceCollection();

  readonly termCollection: TermCollection = new TermCollection();

  protected companySelected: string = '';
  protected modeSelected: string = '';
  protected positionSelected: string = '';
  protected sourceSelected: string = '';
  protected termSelected: string = '';

  constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    // Initialize the collections
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
    this.loader.show();
    this.listCompanies();
    this.listModes(false);
    this.listPositions(false);
    this.listSources(false);
    this.listTerms(false);
    this.loader.hide();
  }

  /**
   * List the companies.
   * It calls the company service to get the list of companies.
   *
   * @private
   * @method
   * @memberof CompanyComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  private listCompanies(): void {
    this.loader.show();
    this.companyService.getCompanies(true).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.companyCollection.companies = response.companyTOCollection,
        error: (errorResponse) => this.setErrorFound('companies', errorResponse),
        complete: () => this.logInfo('Get companies completed.')
      });
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
  private listModes(includeInactive: boolean): void {
    this.loader.show();
    this.modeService.getModes(includeInactive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.modeCollection.modes =response.modeTOCollection,
        error: (errorResponse) => this.setErrorFound('modes', errorResponse),
        complete: () => this.logInfo('Get modes completed.')
      });
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
  private listPositions(includeActive: boolean): void {
    this.positionService.getPositions(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.positionCollection.positions = response.positionTOCollection,
        error: (error: any) => this.setErrorFound('positions', error),
        complete: () => this.logInfo('Get positions completed.')
      });
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
  private listSources(includeActive: boolean): void {
    this.sourceService.getSources(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.sourceCollection.sources = response.sourceTOList,
        error: (error: any) => this.setErrorFound('sources', error),
        complete: () => this.logInfo('Get sources completed.')
      });
  }

  /**
   * Get the list of terms.
   * It calls the term service to get the list of terms.
   *
   * @method
   * @memberof TermComponent
   * @description Get terms
   * @param includeActive - A boolean value to determine whether to include active terms.
   * @since 1.0.0
   * @version 1.0.0
   */
  private listTerms(includeActive: boolean): void {
    this.termService.getTerm(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.termCollection.terms = response.termTOCollection,
        error: (error: any) => this.setErrorFound('terms', error),
        complete: () => this.logInfo('Get terms completed.')
      });
  }

  private setErrorFound(element: string, errorResponse: Error): void {
    this.isErrorFound = true;
    this.logError(`Error occurred while getting ${element} ${errorResponse}`);
  }

  saveOffer() {
    this.logInfo('Save offer');
  }
}
