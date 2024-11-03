import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {AppState, SharedData} from '@app/state/app.state';
import {AppConst} from '@app/shared/util/app-const';
import {StoreComponent} from './store.component';
import {Component} from '@angular/core';

@Component({
  selector: 'app-test-store',
  template: ''
})
class TestStoreComponent extends StoreComponent {
  constructor(store: Store<{ app: AppState }>) {
    super(store);
  }
}

describe('StoreComponent', () => {
  let component: TestStoreComponent;
  let fixture: ComponentFixture<TestStoreComponent>;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy()
    };

    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [TestStoreComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not authenticated', () => {
    mockStore.select.and.returnValue(of(new SharedData()));
    component.sharedDataCurrent.logged = false;
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith([AppConst.JOBS_NAVIGATOR.LOGIN_PATH]);
  });

  it('should set sharedDataCurrent to default if sharedData$ is empty', () => {
    mockStore.select.and.returnValue(of(null));
    component.ngOnInit();
    expect(component.sharedDataCurrent).toEqual(new SharedData());
  });
});