import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {TermService} from "./term.service";
import {takeUntil} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {AppConst} from "@shared/util/app-const";

@Component({
    selector: 'app-term',
    standalone: true,
    imports: [
        AsyncPipe,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatFormField,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatPaginator,
        MatProgressSpinner,
        MatRow,
        MatRowDef,
        MatSlideToggle,
        MatSort,
        MatSortHeader,
        MatTable,
        TranslateModule,
        RouterLink,
        RouterLinkActive,
        MatTooltip,
        FormsModule,
        MatHeaderCellDef
    ],
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
     * dataSource is an array of companies.
     */
    readonly displayedColumns: Iterable<string> = ['id', 'name', 'description', 'active', 'edit', 'add_status', 'delete'];

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
     * AppConst is an instance of the AppConst.
     * It is used to access the constants.
     *
     * @type {AppConst}
     */
    protected readonly appConst = AppConst;

    /**
     * The MatPaginator is a component to control the pagination of a table.
     */
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    /**
     * The MatSort is a component to control the sorting of a table.
     */
    @ViewChild(MatSort) sort!: MatSort;

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
        this.loader.show();
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
                next: (response: any) => this.dataProcess(response.termTOCollection, this.sort, this.paginator),
                error: (error: any) => {
                    this.isErrorFound = true;
                    this.logError(`Error occurred while getting term ${error}`);
                    this.loader.hide();
                }, complete: () => {
                    this.logInfo('Get term completed.');
                    this.loader.hide();
                }
            });
    }

    // PENDING - Implement the following methods
    addStatus(element: any) {
        console.log('Adding status', element);
    }

    // PENDING - Implement the following methods
    deleteTerm(element: any) {
        console.log('Deleting company', element);
    }

    // PENDING - Implement the following methods
    exportToExcel() {
        console.log('Export company list to excel');

    }

    // PENDING - Implement the following methods
    showInactive() {
        console.log('Showing inactive');
        return false;
    }

}
