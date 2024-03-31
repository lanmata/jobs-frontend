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
import {CommonModule, DatePipe} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {provideNativeDateAdapter} from '@angular/material/core';
import {AppConst} from "@shared/util/app-const";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NewOfferRequest} from "../offer.model";
import {OfferService} from "../offer.service";
import {FormatUtil} from "@shared/util/format.util";
import {StatusCollection} from "../../status/status.model";
import {StatusService} from "../../status/status.service";
import {AlertService} from "@shared/services/alert.service";

@Component({
  selector: 'app-new-offer',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-offer.component.html',
  styleUrl: './new-offer.component.css'
})
export class NewOfferComponent implements OnInit, OnDestroy, AfterViewInit {

  public isErrorFound = false;

  protected logInfo: (...arg: any) => void;

  protected logError: (...arg: any) => void;

  protected changeDetectorRefs = inject(ChangeDetectorRef);

  protected subject$: Subject<void> = new Subject<void>();

  protected readonly appConst = AppConst;

  private companyService: CompanyService = inject(CompanyService);

  private modeService: ModeService = inject(ModeService);

  private positionService: PositionService = inject(PositionService);

  private offerService: OfferService = inject(OfferService);

  private sourceService: SourceService = inject(SourceService);

  private statusService: StatusService = inject(StatusService);

  private termService: TermService = inject(TermService);

  private alertService: AlertService = inject(AlertService);

  private formBuilder = inject(FormBuilder);

  private datePipe = inject(DatePipe);

  private formatUtil!: FormatUtil;

  private router: Router = inject(Router);

  protected loader: LoadingService = inject(LoadingService);

  readonly companyCollection: CompanyCollection = new CompanyCollection();

  readonly modeCollection: ModeCollection = new ModeCollection();

  readonly positionCollection = new PositionCollection();

  readonly sourceCollection: SourceCollection = new SourceCollection();

  readonly termCollection: TermCollection = new TermCollection();

  readonly statusCollection: StatusCollection = new StatusCollection();

  newOfferForm: FormGroup;

  constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
    // Initialize the collections
    this.newOfferForm = this.formBuilder.group({
      company: ['', [Validators.required]],
      mode: ['', [Validators.required]],
      position: ['', [Validators.required]],
      source: ['', [Validators.required]],
      term: ['', [Validators.required]],
      mountRate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      createdDate: ['', [Validators.required]],
    });
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
    this.formatUtil = new FormatUtil(this.datePipe);
    this.listCompanies();
    this.listModes(false);
    this.listPositions(false);
    this.listSources(false);
    this.listStatus(false);
    this.listTerms(false);
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
    this.modeService.getModes(includeInactive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.modeCollection.modes = response.modeTOCollection,
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
   * Get the list of statuses.
   * It calls the status service to get the list of statuses.
   *
   * @method
   * @memberof StatusComponent
   * @description Get statuses
   * @param includeActive - A boolean value to determine whether to include active statuses.
   * @since 1.0.0
   * @version 1.0.0
   */
  private listStatus(includeActive: boolean): void {
    this.statusService.getStatus(includeActive).pipe(takeUntil(this.subject$))
      .subscribe({
        next: (response: any) => this.statusCollection.statuses = response.statusTOCollection,
        error: (error: any) => this.setErrorFound('statuses', error),
        complete: () => this.logInfo('Get statuses completed.')
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
        complete: () => {
          this.logInfo('Get terms completed.');
          this.loader.hide();
        }
      });
  }

  /**
   * Set the error found.
   * It sets the error found to true and logs the error.
   *
   * @method
   * @memberof NewOfferComponent
   * @param element - The element to set the error found.
   * @param errorResponse - The error response to log.
   * @since 1.0.0
   * @version 1.0.0
   */
  private setErrorFound(element: string, errorResponse: Error): void {
    this.isErrorFound = true;
    this.logError(`Error occurred while getting ${element} ${errorResponse}`);
  }

  /**
   * Save the offer.
   * It creates a new offer request and calls the offer service to post the offer.
   *
   * @method
   * @memberof NewOfferComponent
   * @since 1.0.0
   * @version 1.0.0
   */
  protected saveOffer() {
    const newOfferRequest: NewOfferRequest = new NewOfferRequest();
    newOfferRequest.title = 'Pending to be included in the form';
    newOfferRequest.description = 'Pending to be included in the form';
    newOfferRequest.reference = 'Pending to be included in the form';
    newOfferRequest.companyId = this.newOfferForm.controls['company'].value;
    newOfferRequest.positionId = this.newOfferForm.controls['position'].value;
    newOfferRequest.sourceId = this.newOfferForm.controls['source'].value;
    newOfferRequest.termId = this.newOfferForm.controls['term'].value;
    newOfferRequest.modeId = this.newOfferForm.controls['mode'].value;
    newOfferRequest.statusId = this.newOfferForm.controls['status'].value;
    newOfferRequest.mountRate = this.newOfferForm.controls['mountRate'].value;
    const dateResult = this.formatUtil.datetimeStandard(this.newOfferForm.controls['createdDate'].value);
    if (dateResult) {
      newOfferRequest.dateTime = dateResult;
    }

    this.offerService.postOffer(newOfferRequest).pipe(takeUntil(this.subject$)).subscribe({
      next: (response: any) => {
        if (null !== response && response.id && response.id.length > 0) {
          this.logInfo('Offer saved');
          this.alertService.success(`Created  offer #${response.id} successfully`, true);
          this.router.navigate([this.appConst.JOBS_NAVIGATOR.OFFER_PATH]);
        }
      }, error: (errorResponse) => {
        this.isErrorFound = true;
        this.logError(`Error occurred while saving offer ${errorResponse}`);
      }
    });
  }
}
