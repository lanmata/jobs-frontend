import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermComponent } from './term.component';
import {TermService} from "./term.service";
import {DebugElement} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";

describe('TermComponent', () => {
  let component: TermComponent;
  let fixture: ComponentFixture<TermComponent>;
  let termService: TermService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermComponent, HttpClientTestingModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TermComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    termService = debugElement.injector.get(TermService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list term including inactive ones when requested', () => {
    const mockTerm = {
      termTOCollection: [
        {
          id: 'ee0d55ce-827c-4663-a99f-38324b9322a8',
          name: 'Term 1',
          description: 'Description Term 1',
          active: true
        },
        {
          id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e',
          name: 'Term 2',
          description: 'Description Term 2',
          active: false
        }
      ]
    };

    spyOn(termService, 'getTerm').and.returnValue(of(mockTerm));
    component.ngOnInit();

    expect(component.dataSource).toEqual(mockTerm.termTOCollection);
  });

  it('should handle error when listing term fails', () => {
    const errorResponse = new Error('Error occurred while getting term');
    spyOn(termService, 'getTerm').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

});
