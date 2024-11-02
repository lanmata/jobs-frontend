import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {MaterialModule} from "@shared/material/material.module";
import {LoadingService} from "@shared/services/loading.service";
import {ModeService} from "./mode.service";
import {takeUntil} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

/**
 * ModeComponent is a component that handles the mode related operations.
 * It extends from the AbstractComponent.
 *
 * @extends {AbstractComponent}
 */
@Component({
    selector: 'app-mode',
    standalone: true,
    imports: [MaterialModule, AsyncPipe, TranslateModule, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: 'mode.component.html',
    styleUrl: 'mode.component.css'
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
     * dataSource is an array of modes.
     */
    readonly displayedColumns: Iterable<string> = ['id', 'name', 'description', 'active', 'edit', 'add_status', 'delete'];

    /**
     * @type {ModeService}
     * @memberof ModeComponent
     * @description ModeModel service
     * @private
     * @default inject(ModeService)
     * @since 1.0.0
     * @version 1.0.0
     * @see ModeService
     */
    private readonly modeService: ModeService = inject(ModeService);

    /**
     * @type {MatPaginator}
     */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /**
     * @type {MatSort}
     */
    @ViewChild(MatSort) sort!: MatSort;

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
        this.loader.show();
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
    private listModes(includeInactive: boolean): void {
        this.loader.show();
        this.modeService.getModes(includeInactive).pipe(takeUntil(this.subject$))
            .subscribe({
                next: (response: any) => this.dataProcess(response.modeTOCollection, this.sort, this.paginator),
                error: (error: any) => {
                    this.isErrorFound = true;
                    this.logError(`Error occurred while getting modes ${error}`);
                    this.loader.hide();
                }, complete: () => {
                    this.logInfo('Get modes completed.');
                    this.loader.hide();
                }
            });
    }

    // PENDING - Implement the following methods
    addStatus(element: any) {
        console.log('Adding status', element);
    }

    // PENDING - Implement the following methods
    deleteCompany(element: any) {
        console.log('Deleting mode', element);
    }

    // PENDING - Implement the following methods
    exportToExcel() {
        console.log('Export mode list to excel');

    }

    // PENDING - Implement the following methods
    showInactive() {
        console.log('Showing inactive');
        return false;
    }

}
