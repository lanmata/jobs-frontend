import {Component} from '@angular/core';
import {FooterComponent} from "@app/footer/footer.component";
import {HeaderComponent} from "@app/header/header.component";
import {RouterOutlet} from "@angular/router";
import {animate, query, style, transition, trigger} from "@angular/animations";

export const routeTransitionAnimations = trigger('routeAnimations', [
    transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':enter', [style({ opacity: 0 }), animate('500ms ease-in', style({ opacity: 1 }))], { optional: true }),
        query(':leave', [style({ opacity: 1 }), animate('500ms ease-out', style({ opacity: 0 }))], { optional: true })
    ])
]);

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    animations: [routeTransitionAnimations]
})
export class MainComponent {


    constructor() {

    }

    getRouteAnimationData(outlet: any) {
        return outlet.activatedRouteData.animation;
    }

}
