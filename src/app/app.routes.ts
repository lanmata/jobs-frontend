import {Routes} from '@angular/router';
import {AppConst} from "@shared/util/app-const";

export const routes: Routes = [
  {
    path: AppConst.JOBS_NAVIGATOR.COMPANY_PATH,
    loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.MODE_PATH,
    loadComponent: () => import('./mode/mode.component').then(m => m.ModeComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.OFFER_PATH,
    loadComponent: () => import('./offer/offer.component').then(m => m.OfferComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.POSITION_PATH,
    loadComponent: () => import('./position/position.component').then(m => m.PositionComponent)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
