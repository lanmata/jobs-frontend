import {Component, inject, ViewChild} from "@angular/core";
import {AbstractComponent} from "@shared/components/abstract-component";
import {LoadingService} from "@shared/services/loading.service";
import {takeUntil} from "rxjs";
import {CompanyService} from "./company.service";
import {MaterialModule} from "@shared/material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {FormsModule} from "@angular/forms";
import {RouterLink, RouterLinkActive} from "@angular/router";

/**
 * CompanyComponent is a component that handles the company related operations.
 * It extends from the AbstractComponent.
 *
 * @extends {AbstractComponent}
 */
@Component({
    selector: 'app-company',
    standalone: true,
    imports: [MaterialModule, MatSortModule, TranslateModule, FormsModule, AsyncPipe, RouterLink, RouterLinkActive],
    templateUrl: 'company.component.html',
    styleUrl: 'company.component.css'
})
export class CompanyComponent extends AbstractComponent {
    /**
     * Loader is an instance of LoadingService.
     * It is used to handle the loading operations.
     *
     * @type {LoadingService}
     * @public
     */
    public loader: LoadingService = inject(LoadingService);

    /**
     * dataSource is an array of companies.
     */
    readonly displayedColumns: Iterable<string> = ['id', 'name', 'description', 'active', 'edit', 'add_status', 'delete'];

    /**
     * CompanyService is an instance of the CompanyService.
     * It is used to handle the company related operations.
     *
     * @type {CompanyService}
     * @private
     */
    private readonly companyService: CompanyService = inject(CompanyService);

    /**
     * The MatPaginator is a component to control the pagination of a table.
     */
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    /**
     * The MatSort is a component to control the sorting of a table.
     */
    @ViewChild(MatSort) sort!: MatSort;

    /**
     * Constructor for the CompanyComponent.
     * It calls the constructor of the parent class.
     */
    constructor() {
        super();
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
                next: (response: any) => this.dataProcess(response.companyTOCollection, this.sort, this.paginator),
                error: (errorResponse) => {
                    this.isErrorFound = true;
                    this.logError(`Error occurred while getting companies ${errorResponse}`);
                    this.loader.hide();
                }, complete: () => {
                    this.logInfo('Get companies completed.');
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
