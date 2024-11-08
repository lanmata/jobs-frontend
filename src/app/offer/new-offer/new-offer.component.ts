import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ModeService} from "@app/mode/mode.service";
import {TermService} from '@app/term/term.service';
import {PositionService} from "@app/position/position.service";
import {CompanyService} from "@app/company/company.service";
import {SourceService} from "@app/source/source.service";
import {CompanyCollection} from "@app/company/company.model";
import {LoadingService} from "@shared/services/loading.service";
import {Subject, takeUntil} from "rxjs";
import {ModeCollection} from "@app/mode/mode.model";
import {PositionCollection} from "@app/position/position.model";
import {SourceCollection} from '@app/source/source.model';
import {TermCollection} from "@app/term/term.model";
import {CommonModule, DatePipe} from "@angular/common";
import {MaterialModule} from "@shared/material/material.module";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {provideNativeDateAdapter} from '@angular/material/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NewOfferRequest} from "../offer.model";
import {OfferService} from "../offer.service";
import {FormatUtil} from "@shared/util/format.util";
import {StatusCollection} from "@app/status/status.model";
import {StatusService} from "@app/status/status.service";
import {AlertService} from "@shared/services/alert.service";
import { AppConst } from '@app/shared/util/app-const';

/**
 * Component for creating a new job offer.
 * Implements OnInit, OnDestroy, and AfterViewInit lifecycle hooks.
 */
@Component({
    selector: 'app-new-offer',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule, FlexModule, TranslateModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
    providers: [provideNativeDateAdapter()],
    templateUrl: 'new-offer.component.html',
    styleUrl: 'new-offer.component.css'
})
export class NewOfferComponent implements OnInit, OnDestroy, AfterViewInit {

    /** Flag to indicate if an error was found */
    public isErrorFound = false;

    /** Function to log information */
    protected logInfo: (...arg: any) => void;

    /** Function to log errors */
    protected logError: (...arg: any) => void;

    /** Change detector reference */
    protected changeDetectorRefs = inject(ChangeDetectorRef);

    /** Subject to handle component destruction */
    protected subject$: Subject<void> = new Subject<void>();

    /** router is an instance of the Router. */
    protected readonly router: Router = inject(Router);

    /**
     * AppConst is an instance of the AppConst.
     * It is used to access the constants.
     * @type {AppConst}
     * @memberof StoreComponent
     * @description AppConst
     * @public
     * @since 1.0.0
     * @version 1.0.0
     * @see AppConst
     */
    protected readonly appConst = AppConst;

    /** Services injected */
    private readonly companyService: CompanyService = inject(CompanyService);
    private readonly modeService: ModeService = inject(ModeService);
    private readonly positionService: PositionService = inject(PositionService);
    private readonly offerService: OfferService = inject(OfferService);
    private readonly sourceService: SourceService = inject(SourceService);
    private readonly statusService: StatusService = inject(StatusService);
    private readonly termService: TermService = inject(TermService);
    private readonly alertService: AlertService = inject(AlertService);

    /** Form builder */
    private readonly formBuilder = inject(FormBuilder);

    /** Date pipe for formatting dates */
    private readonly datePipe = inject(DatePipe);

    /** Utility for formatting */
    private formatUtil!: FormatUtil;

    /** Loading service */
    protected loader: LoadingService = inject(LoadingService);

    /** Collections for various entities */
    readonly companyCollection: CompanyCollection = new CompanyCollection();
    readonly modeCollection: ModeCollection = new ModeCollection();
    readonly positionCollection = new PositionCollection();
    readonly sourceCollection: SourceCollection = new SourceCollection();
    readonly termCollection: TermCollection = new TermCollection();
    readonly statusCollection: StatusCollection = new StatusCollection();

    /** Form group for the new offer form */
    newOfferForm: FormGroup;

    /**
     * Constructor to initialize the component.
     * Sets up logging functions and initializes the form group.
     */
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
     * Initializes the format utility and lists various entities.
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
                next: (response: any) => this.companyCollection.companies = response.list,
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
                next: (response: any) => this.modeCollection.modes = response.list,
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
                next: (response: any) => this.positionCollection.positions = response.list,
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
                next: (response: any) => this.sourceCollection.sources = response.list,
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
                next: (response: any) => this.statusCollection.statuses = response.list,
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
                next: (response: any) => this.termCollection.terms = response.list,
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
    setErrorFound(element: string, errorResponse: Error): void {
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
    saveOffer() {
        const newOfferRequest: NewOfferRequest = new NewOfferRequest();
        newOfferRequest.title = 'Pending to be included in the form';
        newOfferRequest.description = 'Pending to be included in the form';
        newOfferRequest.reference = 'Pending to be included in the form';
        newOfferRequest.companyId = this.newOfferForm.get('company')?.value;
        newOfferRequest.positionId = this.newOfferForm.get('position')?.value;
        newOfferRequest.sourceId = this.newOfferForm.get('source')?.value;
        newOfferRequest.termId = this.newOfferForm.get('term')?.value;
        newOfferRequest.modeId = this.newOfferForm.get('mode')?.value;
        newOfferRequest.statusId = this.newOfferForm.get('status')?.value;
        newOfferRequest.mountRate = this.newOfferForm.get('mountRate')?.value;
        const dateResult = this.formatUtil.datetimeStandard(this.newOfferForm.get('createdDate')?.value);
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