import {TestBed} from "@angular/core/testing";
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {NotifyComponent} from "@shared/components/notify-component/notify.component";

it('should create NotifyComponent with correct message', () => {
  const data = { message: 'Test message' };
  const snackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
  TestBed.configureTestingModule({
    providers: [
      { provide: MAT_SNACK_BAR_DATA, useValue: data },
      { provide: MatSnackBarRef, useValue: snackBarRef }
    ]
  });
  const fixture = TestBed.createComponent(NotifyComponent);
  const component = fixture.componentInstance;
  expect(component).toBeTruthy();
  expect(component.message).toEqual(data.message);
});

it('should handle empty message data', () => {
  const snackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
  TestBed.configureTestingModule({
    providers: [
      { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      { provide: MatSnackBarRef, useValue: snackBarRef }
    ]
  });
  const fixture = TestBed.createComponent(NotifyComponent);
  const component = fixture.componentInstance;
  expect(component).toBeTruthy();
  expect(component.message).toEqual('');
});
