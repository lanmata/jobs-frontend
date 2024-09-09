import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderComponent} from './header.component';
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {provideHttpClientTesting} from "@angular/common/http/testing"
import {DatePipe} from "@angular/common";
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AlertService} from "@shared/services/alert.service";
import {NotifyComponent} from "@shared/components/notify-component/notify.component";

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let alertService: AlertService;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [HeaderComponent, TranslateModule.forRoot()],
            providers: [
                DatePipe,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({id: 'testId'})
                    }
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        alertService = TestBed.inject(AlertService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have appConst defined', () => {
        expect(component.appConst).toBeDefined();
    });

    it('should display success notification', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of({type: 'success', text: 'Success message', duration: 3}));
        const snackBarSpy = spyOn(component['_snackBar'], 'openFromComponent');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).toHaveBeenCalledWith(NotifyComponent, {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000,
            data: {message: 'Success message'}
        });
    });

    it('should display error notification', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of({type: 'error', text: 'Error message', duration: 3}));
        const snackBarSpy = spyOn(component['_snackBar'], 'open');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).toHaveBeenCalledWith('Error message', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 9000
        });
    });

    it('should display warning notification', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of({type: 'warning', text: 'Warning message', duration: 3}));
        const snackBarSpy = spyOn(component['_snackBar'], 'open');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).toHaveBeenCalledWith('Warning message', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 9000
        });
    });

    it('should display info notification', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of({type: 'info', text: 'Info message', duration: 3}));
        const snackBarSpy = spyOn(component['_snackBar'], 'open');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).toHaveBeenCalledWith('Info message', '', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 9000
        });
    });

    it('should handle undefined alert', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of(undefined));
        const snackBarSpy = spyOn(component['_snackBar'], 'open');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).not.toHaveBeenCalled();
    });

    it('should handle alert with unknown type', () => {
        spyOn(alertService, 'getAlert').and.returnValue(of({type: 'unknown', text: 'Unknown message', duration: 3}));
        const snackBarSpy = spyOn(component['_snackBar'], 'open');
        component.ngOnInit();
        fixture.detectChanges();
        expect(snackBarSpy).not.toHaveBeenCalled();
    });
});
