import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "./header/header.component";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";
import {Store} from '@ngrx/store';
import {AppState, SharedData} from './state/app.state';
import {Observable} from 'rxjs';

@Component({
    imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
    providers: [DatePipe],
    selector: 'app-root',
    standalone: true,
    styleUrl: './app.component.scss',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    sharedData$: Observable<SharedData>;
    sharedDataCurrent: SharedData = new SharedData();

    /** Function to log information */
    protected logInfo: (...arg: any) => void;

    /** Function to log errors */
    protected logError: (...arg: any) => void;

    constructor(private store: Store<{ app: AppState }>) {
        this.logInfo = (...arg: any) => console.info(arg);
        this.logError = (...arg: any) => console.error(arg);
        this.sharedData$ = store.select(state => state.app.sharedData);
    }

    ngOnInit(): void {
        this.sharedData$.subscribe(data => {
            console.log(data);
            this.sharedDataCurrent = data;
            this.logged = this.sharedDataCurrent.logged;
            this.logInfo("Actualizado {}", this.logged);
        });
    }

    title = 'jobs-frontend';
    logged: boolean = false;
}
