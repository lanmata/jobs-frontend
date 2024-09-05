import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HeaderComponent} from './header.component';
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing"
import {DatePipe} from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HeaderComponent, TranslateModule.forRoot()],
    providers: [
        DatePipe,
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ id: 'testId' })
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have appConst defined', () => {
    expect(component.appConst).toBeDefined();
  });
});
