import {Routes} from '@angular/router';
import {AppConst} from "@shared/util/app-const";
import {CompanyComponent} from "./company/company.component";
import {ModeComponent} from "./mode/mode.component";
import {SourceComponent} from "./source/source.component";
import {PositionComponent} from "./position/position.component";
import {StatusComponent} from "./status/status.component";
import {NewOfferComponent} from "./offer/new-offer/new-offer.component";
import {OfferComponent} from "./offer/offer.component";
import {TermComponent} from "./term/term.component";

export const routes: Routes = [
  {
    path: AppConst.JOBS_NAVIGATOR.COMPANY_PATH, component: CompanyComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.MODE_PATH, component: ModeComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.OFFER_PATH, component: OfferComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.NEW_OFFER_PATH, component: NewOfferComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.POSITION_PATH, component: PositionComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.SOURCE_PATH, component: SourceComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.STATUS_PATH, component: StatusComponent
  },
  {
    path: AppConst.JOBS_NAVIGATOR.TERM_PATH, component: TermComponent
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
