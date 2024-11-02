import {Routes} from '@angular/router';
import {AppConst} from "@shared/util/app-const";
import {CompanyComponent} from "@app/company/company.component";
import {ModeComponent} from "@app/mode/mode.component";
import {SourceComponent} from "@app/source/source.component";
import {PositionComponent} from "@app/position/position.component";
import {StatusComponent} from "@app/status/status.component";
import {NewOfferComponent} from "@app/offer/new-offer/new-offer.component";
import {OfferComponent} from "@app/offer/offer.component";
import {TermComponent} from "@app/term/term.component";
import {EditOfferComponent} from "@app/offer/edit-offer/edit-offer.component";
import {LoginComponent} from "@app/login/login.component";
import {authGuard} from '@app/guard/auth.guard';
import {MainComponent} from './main/main.component';

export const routes: Routes = [
    {
        path: '', redirectTo: AppConst.JOBS_NAVIGATOR.LOGIN_PATH, pathMatch: 'full'
    },
    {
        path: AppConst.JOBS_NAVIGATOR.LOGIN_PATH, component: LoginComponent
    },
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: AppConst.JOBS_NAVIGATOR.COMPANY_PATH, component: CompanyComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.MODE_PATH, component: ModeComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.OFFER_PATH, component: OfferComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.POSITION_PATH, component: PositionComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.SOURCE_PATH, component: SourceComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.STATUS_PATH, component: StatusComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.NEW_OFFER_PATH, component: NewOfferComponent, canActivate: [authGuard]
            },
            {
                path: `${AppConst.JOBS_NAVIGATOR.EDIT_OFFER_PATH}/:offerId`, component: EditOfferComponent, canActivate: [authGuard]
            },
            {
                path: AppConst.JOBS_NAVIGATOR.TERM_PATH, component: TermComponent, canActivate: [authGuard]
            }
        ]
    }
];
