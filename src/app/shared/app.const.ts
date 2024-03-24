import {HttpHeaders} from '@angular/common/http';

export const JOB_BACKEND_SERVICE_BASE_URL = '/jobs/v1';
export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
// tslint:disable-next-line:no-namespace
export namespace AppConstants {
}
