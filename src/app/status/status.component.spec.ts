import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusComponent} from './status.component';
import {DebugElement} from "@angular/core";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {StatusService} from "./status.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  let statusService: StatusService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [StatusComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    statusService = debugElement.injector.get(StatusService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list status including inactive ones when requested', () => {
    const mockStatus = {
      statusTOCollection: [
        {
          id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
          name: 'StatusModel 1',
          description: 'Description StatusModel 1',
          active: true
        },
        {
          id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
          name: 'StatusModel 2',
          description: 'Description StatusModel 2',
          active: false
        }
      ]
    };

    spyOn(statusService, 'getStatus').and.returnValue(of(mockStatus));
    component.ngOnInit();

    expect(component.dataSource).toEqual(mockStatus.statusTOCollection);
  });

  it('should handle error when listing status fails', () => {
    const errorResponse = new Error('Error occurred while getting status');
    spyOn(statusService, 'getStatus').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

});
