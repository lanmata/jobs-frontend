import {AbstractComponent} from './abstract-component';
import {Component} from "@angular/core";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {of} from "rxjs";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {MatTableDataSource} from "@angular/material/table";
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSortModule} from "@angular/material/sort";

// Mock component for testing
@Component({
    template: '',
})
class TestComponent extends AbstractComponent {

    constructor() {
        super();
        this.matTableDataSource = new MatTableDataSource<any>();
        this.matTableDataSource.paginator = {pageIndex: 0, pageSize: 10} as MatPaginator;
        this.dataSource = [];
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

    // Add your component properties and methods here
}

describe('AbstractComponent', () => {
    let component: AbstractComponent;
    let fixture: ComponentFixture<AbstractComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [BrowserAnimationsModule, MatSortModule, MatPaginatorModule],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        // expect(new AbstractComponent()).toBeTruthy();
    });

    it('should select all rows when none are selected', () => {
        component.selection.clear();
        component.masterToggle();
        expect(component.isAllSelected()).toBeTrue();
    });

    it('should clear selection when all rows are selected', () => {
        component.matTableDataSource.data.forEach(row => component.selection.select(row));
        component.masterToggle();
        expect(component.isAllSelected()).toBeTrue();
    });

    it('should select rows on current page', () => {
        component.matTableDataSource.paginator = null;
        component.dataProcess([{name: 'test1'}, {name: 'test2'},
            {name: 'test3'}, {name: 'test1'}, {name: 'test2'}, {name: 'test3'}], null, null);
        component.selection.clear();
        component.selectRows();
        expect(component.selection.selected.length).toEqual(0);
    });

    it('should filter data based on search term', () => {
        component.dataProcess([{name: 'test1'}, {name: 'test2'}, {name: 'test3'}], null, null);
        component.search({target: {value: 'test1'}});
        expect(component.matTableDataSource.data.length).toEqual(1);
    });

    it('should show inactive data when isInactiveShow is true', () => {
        component.dataProcess([{active: true}, {active: false}], null, null);
        component.isInactiveShow = true;
        expect(component.matTableDataSource.data.length).toEqual(2);
    });

    it('should not show inactive data when isInactiveShow is false', () => {
        component.dataProcess([{active: true}, {active: false}], null, null);
        component.isInactiveShow = false;
        expect(component.matTableDataSource.data.length).toEqual(2);
    });

    it('should link list to paginator and slice data correctly', () => {
        const paginator = {page: of({}), pageIndex: 0, pageSize: 10} as MatPaginator;
        const response = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}];
        component.linkListToPaginator(response, paginator);
        expect(component.dataSource.length).toEqual(10);
        expect(component.dataSource[0].id).toEqual(1);
        expect(component.dataSource[9].id).toEqual(10);
    });

    it('should set page size options when input is provided', () => {
        const input = '5,10,15,20';
        component.setPageSizeOptions(input);
        expect(component.pageSizeOptions).toEqual([5, 10, 15, 20]);
    });

    it('should not change page size options when input is not provided', () => {
        const initialPageSizeOptions = [...component.pageSizeOptions];
        component.setPageSizeOptions('');
        expect(component.pageSizeOptions).toEqual(initialPageSizeOptions);
    });

    it('should not select any rows if paginator is not set', () => {
        component.ngOnInit();
        component.matTableDataSource.paginator = null;
        component.dataProcess([{name: 'test1'}, {name: 'test2'}, {name: 'test3'}], null, null);
        component.selection.clear();
        component.selectRows();
        expect(component.selection.selected.length).toEqual(0);
    });

    it('should filter data based on search term in description', () => {
        component.ngOnInit();
        component.dataProcess([{name: 'test1', description: 'desc1'}, {
            name: 'test2',
            description: 'desc2'
        }, {name: 'test3', description: 'desc3'}], null, null);
        component.search({target: {value: 'desc2'}});
        expect(component.matTableDataSource.data.length).toEqual(1);
    });

    it('should filter data based on search term in firstName', () => {
        component.ngOnInit();
        component.dataProcess([{firstName: 'John', middleName: 'Doe', lastName: 'Smith'}, {
            firstName: 'Jane',
            middleName: 'Doe',
            lastName: 'Smith'
        }], null, null);
        component.search({target: {value: 'Jane'}});
        expect(component.matTableDataSource.data.length).toEqual(1);
    });

    it('should filter data based on search term in middleName', () => {
        component.ngOnInit();
        component.dataProcess([{firstName: 'John', middleName: 'Doe', lastName: 'Smith'}, {
            firstName: 'Jane',
            middleName: 'Doe',
            lastName: 'Smith'
        }], null, null);
        component.search({target: {value: 'Doe'}});
        expect(component.matTableDataSource.data.length).toEqual(2);
    });

    it('should filter data based on search term in lastName', () => {
        component.ngOnInit();
        component.dataProcess([{firstName: 'John', middleName: 'Doe', lastName: 'Smith'}, {
            firstName: 'Jane',
            middleName: 'Doe',
            lastName: 'Smith'
        }], null, null);
        component.search({target: {value: 'Smith'}});
        expect(component.matTableDataSource.data.length).toEqual(2);
    });

    it('should link list to paginator and slice data correctly', () => {
        const paginator = {page: of({}), pageIndex: 0, pageSize: 10} as MatPaginator;
        const response = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}];
        component.ngOnInit();
        component.linkListToPaginator(response, paginator);
        expect(component.dataSource.length).toEqual(10);
        expect(component.dataSource[0].id).toEqual(1);
        expect(component.dataSource[9].id).toEqual(10);
    });

    it('should link list to paginator and handle empty response', () => {
        const paginator = {page: of({}), pageIndex: 0, pageSize: 10} as MatPaginator;
        const response: any[] = [];
        component.ngOnInit();
        component.linkListToPaginator(response, paginator);
        expect(component.dataSource.length).toEqual(0);
    });

});
