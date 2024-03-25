import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AfterViewInit, ChangeDetectorRef, inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {merge, of, startWith, Subject, switchMap} from 'rxjs';

// import {TranslateService} from "@ngx-translate/core";

@Injectable()
export abstract class AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  public matTableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public selection = new SelectionModel<any>(true, []);
  public pageSizeOptions: number[] = [5, 10, 25, 50];
  public isInactiveShow = false;
  public isVisibleDialogConfirm = false;
  public isErrorFound = false;
  public pageSize = 10;
  public dataSource: any[] = [];

  protected logInfo: (...arg: any) => void;
  protected logError: (...arg: any) => void;
  protected subject$: Subject<void> = new Subject<void>();
  protected allData: any[] = [];
  // protected translateService: TranslateService = inject(TranslateService);
  protected changeDetectorRefs = inject(ChangeDetectorRef);

  protected constructor() {
    this.logInfo = (...arg: any) => console.info(arg);
    this.logError = (...arg: any) => console.error(arg);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.matTableDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.matTableDataSource.data.forEach(row => this.selection.select(row));
  }

  selectRows(): void {
    let endIndex: number;
    if (this.matTableDataSource.paginator !== null) {
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

  setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

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

  showInactive(): void {
    if (this.isInactiveShow) {
      this.matTableDataSource.data = this.allData;
    } else {
      this.matTableDataSource.data = this.allData.filter((val => val.active === !this.isInactiveShow));
    }
  }

  dataProcess(response: any, sort: MatSort | null, paginator: MatPaginator | null): void {
    this.allData = response;
    this.matTableDataSource.data = {...this.allData};
    this.matTableDataSource.paginator = paginator;
    this.matTableDataSource.sort = sort;
    this.showInactive();
  }

  linkListToPaginator(response: any[], paginator: MatPaginator) {
    this.allData = response;
    merge(paginator.page).pipe(
      startWith({}),
      switchMap(() => of(this.allData)
      ))
      .subscribe(resp => {
        const from = 1;
        const to = 11;
        this.dataSource = resp.slice(from, to);
      });
  }

  abstract ngAfterViewInit(): void;

  abstract ngOnDestroy(): void;

  abstract ngOnInit(): void;
}
