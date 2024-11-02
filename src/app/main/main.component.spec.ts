import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';
import {of} from "rxjs";
import { Store } from '@ngrx/store';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    let mockStore: any;

    beforeEach(async () => {
        mockStore = {
            select: jasmine.createSpy().and.returnValue(of({})),
            dispatch: jasmine.createSpy()
        };
        await TestBed.configureTestingModule({
            imports: [MainComponent, BrowserAnimationsModule],
            providers: [
                { provide: Store, useValue: mockStore }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
