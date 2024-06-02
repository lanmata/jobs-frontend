import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModeComponent} from './mode.component';
import {DebugElement} from "@angular/core";
import {ModeService} from "./mode.service";
import {of, throwError} from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ModeComponent', () => {
  let component: ModeComponent;
  let fixture: ComponentFixture<ModeComponent>;
  let modeService: ModeService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ModeComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();

    fixture = TestBed.createComponent(ModeComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    modeService = debugElement.injector.get(ModeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list modes including inactive ones when requested', () => {
    const mockModes = {
      modeTOCollection: [
        {id: 'ee0d55ce-827c-4663-a99f-38324b9322a8', name: 'ModeModel 1', description: 'Description ModeModel 1', active: true},
        {id: '7a5ea908-e4e8-4d8d-a777-699158b4c94e', name: 'ModeModel 2', description: 'Description ModeModel 2', active: false}
      ]
    };

    spyOn(modeService, 'getModes').and.returnValue(of(mockModes));
    component.ngOnInit();

    expect(component.dataSource).toEqual(mockModes.modeTOCollection);
  });

  it('should handle error when listing modes fails', () => {
    const errorResponse = new Error('Error occurred while getting modes');
    spyOn(modeService, 'getModes').and.returnValue(throwError(errorResponse));
    component.ngOnInit();
    expect(component.isErrorFound).toBeTrue();
  });

});
