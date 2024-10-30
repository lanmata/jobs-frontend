import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {StatusService} from "./status.service";
import {takeUntil} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@shared/material/material.module";
import {AppConst} from "@shared/util/app-const";

@Component({
    selector: 'app-status',
    standalone: true,
    imports: [MaterialModule, MatSortModule, TranslateModule, FormsModule, AsyncPipe, RouterLink, RouterLinkActive],
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
     * dataSource is an array of companies.
     */
    readonly displayedColumns: Iterable<string> = ['id', 'name', 'description', 'active', 'edit', 'add_status', 'delete'];

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
        this.loader.show();
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
                next: (response: any) => this.dataProcess(response.statusTOCollection, this.sort, this.paginator),
                error: (error: any) => {
                    this.isErrorFound = true;
                    this.logError(`Error occurred while getting status ${error}`);
                    this.loader.hide();
                }, complete: () => {
                    this.logInfo('Get status completed.');
                    this.loader.hide();
                }
            });
    }

    // PENDING - Implement the following methods
    addStatus(element: any) {
        console.log('Adding status', element);
    }

    // PENDING - Implement the following methods
    deleteStatus(element: any) {
        console.log('Deleting status', element);
    }

    // PENDING - Implement the following methods
    exportToExcel() {
        console.log('Export status list to excel');

    }

    // PENDING - Implement the following methods
    showInactive() {
        console.log('Showing inactive');
        return false;
    }

}
