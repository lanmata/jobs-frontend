import {Routes} from '@angular/router';
import {AppConst} from "@shared/util/app-const";
import {CompanyComponent} from "./company/company.component";

export const routes: Routes = [
  {
    path: AppConst.JOBS_NAVIGATOR.COMPANY_PATH, loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.OFFER_PATH, loadComponent: () => import('./offer/offer.component').then(m => m.OfferComponent)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
