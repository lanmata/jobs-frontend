import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngrx/store";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of({})),
      dispatch: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 'testId'})
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('jobs-frontend');
  });

});
