import {Component, inject, ViewChild} from '@angular/core';
import {AbstractComponent} from "@shared/components/abstract-component";
import {PositionService} from "./position.service";
import {LoadingService} from "@shared/services/loading.service";
import {takeUntil} from "rxjs";
import {MaterialModule} from "@shared/material/material.module";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

/**
 * PositionComponent is a component that handles the position related operations.
 * It extends from the AbstractComponent.
 *
 * @extends {AbstractComponent}
 */
@Component({
    selector: 'app-position',
    standalone: true,
    imports: [MaterialModule, AsyncPipe, TranslateModule, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: 'position.component.html',
    styleUrl: 'position.component.css'
})
export class PositionComponent extends AbstractComponent {
    /**
     * @type {LoadingService}
     * @memberof PositionComponent
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
     * @type {PositionService}
     * @memberof PositionComponent
     * @description Position service
     * @private
     * @default inject(PositionService)
     * @since 1.0.0
     * @version 1.0.0
     * @see PositionService
     */
    private readonly positionService: PositionService = inject(PositionService);

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
     * @memberof PositionComponent
     * @description Constructor for the PositionComponent
     * @since 1.0.0
     * @version 1.0.0
     */
    constructor() {
        super();
    }

    /**
     * @method
     * @memberof PositionComponent
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
     * @memberof PositionComponent
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
        this.loader.show();
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
                next: (response: any) => this.dataProcess(response.list, this.sort, this.paginator),
                error: (error: any) => {
                    this.isErrorFound = true;
                    this.logError(`Error occurred while getting positions ${error}`);
                    this.loader.hide();
                }, complete: () => {
                    this.logInfo('Get positions completed.');
                    this.loader.hide();
                }
            });
    }

    // PENDING - Implement the following methods
    addStatus(element: any) {
        console.log('Adding status', element);
    }

    // PENDING - Implement the following methods
    deletePosition(element: any) {
        console.log('Deleting position', element);
    }

    // PENDING - Implement the following methods
    exportToExcel() {
        console.log('Export position list to excel');

    }

    // PENDING - Implement the following methods
    showInactive() {
        console.log('Showing inactive');
        return false;
    }

}
