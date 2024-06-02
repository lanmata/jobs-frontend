import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CompanyComponent} from './company.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {DebugElement} from "@angular/core";
import {CompanyService} from "./company.service";
import {of, throwError} from "rxjs";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let companyService: CompanyService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CompanyComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    companyService = debugElement.injector.get(CompanyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch companies on initialization', () => {
    const companyServiceSpy = spyOn(companyService, 'getCompanies').and.callThrough();
    component.ngOnInit();
    expect(companyServiceSpy).toHaveBeenCalled();
  });

  it('should handle error while getting companies', () => {
    const errorResponse = new Error('Error occurred while getting companies');
    spyOn(companyService, 'getCompanies').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

  it('should update data source when companies are fetched', () => {
    const response = {companyTOCollection: [{id: 1, name: 'Company1'}, {id: 2, name: 'Company2'}]};
    spyOn(companyService, 'getCompanies').and.returnValue(of(response));
    component.ngOnInit();
    expect(component.dataSource).toEqual(response.companyTOCollection);
  });

  it('should hide loader when companies are fetched', () => {
    const response = {companyTOCollection: [{id: 1, name: 'Company1'}, {id: 2, name: 'Company2'}]};
    spyOn(companyService, 'getCompanies').and.returnValue(of(response));
    const loaderSpy = spyOn(component.loader, 'hide').and.callThrough();
    component.ngOnInit();
    expect(loaderSpy).toHaveBeenCalled();
  });
});
