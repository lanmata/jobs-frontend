import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AfterViewInit, ChangeDetectorRef, inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {merge, of, startWith, Subject, switchMap} from 'rxjs';
import {StoreComponent} from "@shared/components/store/store.component";
import {AppConst} from '../util/app-const';
import {Router} from "@angular/router";

/**
 * AbstractComponent is an abstract class that provides common functionality for components that use MatTableDataSource.
 * It includes methods for selecting rows, toggling selection, searching, and linking data to a paginator.
 * This class should be extended by any component that needs this common functionality.
 */
@Injectable()
export abstract class AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
    public matTableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public selection = new SelectionModel<any>(true, []);
    public pageSizeOptions: number[] = [5, 10, 25, 50];
    public isInactiveShow = false;
    public isErrorFound = false;
    public pageSize = 10;
    public dataSource: any[] = [];

    protected logInfo: (...arg: any) => void;
    protected logError: (...arg: any) => void;
    protected subject$: Subject<void> = new Subject<void>();
    public allData: any[] = [];
    protected changeDetectorRefs = inject(ChangeDetectorRef);

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


    /**
     * Constructor for the AbstractComponent class.
     * Initializes logInfo and logError methods.
     */
    protected constructor() {
        this.logInfo = (...arg: any) => console.info(arg);
        this.logError = (...arg: any) => console.error(arg);
    }

    /**
     * Checks if all rows are selected.
     * @returns {boolean} - true if all rows are selected, false otherwise.
     */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.matTableDataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Toggles the selection of all rows.
     * If all rows are selected, it clears the selection. Otherwise, it selects all rows.
     */
    masterToggle(): void {
        this.isAllSelected() ? this.selection.clear() : this.matTableDataSource.data.forEach(row => this.selection.select(row));
    }

    /**
     * Selects all rows in the current page.
     */
    selectRows(): void {
        let endIndex: number;
        if (this.matTableDataSource.paginator) {
            if (this.matTableDataSource.data.length > ((this.matTableDataSource.paginator.pageIndex + 1) * this.matTableDataSource.paginator.pageSize)) {
                endIndex = ((this.matTableDataSource.paginator.pageIndex + 1) * this.matTableDataSource.paginator.pageSize);
            } else {
                endIndex = this.matTableDataSource.data.length;
            }

            for (let index = (this.matTableDataSource.paginator.pageIndex * this.matTableDataSource.paginator.pageSize); index < endIndex; index++) {
                this.selection.select(this.matTableDataSource.data[index]);
            }
        }
    }

    /**
     * Sets the page size options for the paginator.
     * @param {string} setPageSizeOptionsInput - A string of comma-separated numbers representing the page size options.
     */
    setPageSizeOptions(setPageSizeOptionsInput: string): void {
        if (setPageSizeOptionsInput) {
            this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
        }
    }

    /**
     * Filters the data based on the search input.
     * @param {any} event - The event object containing the search input.
     */
    search(event: any): void {
        this.matTableDataSource.data = this.allData.filter((val) => {
            let response: boolean = false;
            if (val.name) {
                response = val.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
                if (!response && val.description) {
                    response = val.description.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
                }
                return response;
            } else {
                if (val.firstName) {
                    response = val.firstName.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
                }
                if (!response && val.middleName) {
                    response = val.middleName.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
                }
                if (!response && val.lastName) {
                    response = val.lastName.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
                }
                return response;
            }
        });
    }

    /**
     * Processes the data and links it to the paginator and sort.
     * @param {any} response - The data to be processed.
     * @param {MatSort | null} sort - The MatSort instance to be linked to the data.
     * @param {MatPaginator | null} paginator - The MatPaginator instance to be linked to the data.
     */
    dataProcess(response: any, sort: MatSort | null, paginator: MatPaginator | null): void {
        this.allData = response;
        this.matTableDataSource = new MatTableDataSource<any>(this.allData);
        if (paginator) {
            this.matTableDataSource.paginator = paginator;
        }
        if (sort) {
            this.matTableDataSource.sort = sort;
        }
    }

    /**
     * Links the data to the paginator.
     * @param {any[]} response - The data to be linked.
     * @param {MatPaginator} paginator - The MatPaginator instance to be linked to the data.
     */
    linkListToPaginator(response: any[], paginator: MatPaginator) {
        this.allData = response;

        const pageObservable = paginator.page ? paginator.page : of({});

        merge(pageObservable).pipe(
            startWith({}),
            switchMap(() => of(this.allData))
        ).subscribe(resp => {
            const from = paginator.pageIndex * paginator.pageSize;
            const to = from + paginator.pageSize;
            this.dataSource = resp.slice(from, to);
        });
    }

    /**
     * Lifecycle hook that is called after a component's view has been fully initialized.
     */
    abstract ngAfterViewInit(): void;

    /**
     * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
     */
    abstract ngOnDestroy(): void;

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     */
    abstract ngOnInit(): void;
}
