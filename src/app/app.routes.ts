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
  {
    path: AppConst.JOBS_NAVIGATOR.SOURCE_PATH,
    loadComponent: () => import('./source/source.component').then(m => m.SourceComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.STATUS_PATH,
    loadComponent: () => import('./status/status.component').then(m => m.StatusComponent)
  },
  {
    path: AppConst.JOBS_NAVIGATOR.TERM_PATH,
    loadComponent: () => import('./term/term.component').then(m => m.TermComponent)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
