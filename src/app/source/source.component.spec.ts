import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SourceComponent} from './source.component';
import {DebugElement} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {SourceService} from "./source.service";

describe('SourceComponent', () => {
  let component: SourceComponent;
  let fixture: ComponentFixture<SourceComponent>;
  let sourceService: SourceService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceComponent, HttpClientTestingModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SourceComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    sourceService = debugElement.injector.get(SourceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list sources including inactive ones when requested', () => {
    const mockSources = {
      sourceTOList: [
        {
          id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
          name: 'Source 1',
          description: 'Description Source 1',
          active: true
        },
        {
          id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
          name: 'Source 2',
          description: 'Description Source 2',
          active: false
        }
      ]
    };

    spyOn(sourceService, 'getSources').and.returnValue(of(mockSources));
    component.ngOnInit();

    expect(component.dataSource).toEqual(mockSources.sourceTOList);
  });

  it('should handle error when listing sources fails', () => {
    const errorResponse = new Error('Error occurred while getting sources');
    spyOn(sourceService, 'getSources').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

});
