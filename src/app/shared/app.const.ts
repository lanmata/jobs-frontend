import { HttpHeaders } from '@angular/common/http';

export const JOB_BACKEND_SERVICE_BASE_URL = '/api/v1';
export const BACKBONE_SERVICE_BASE_URL = 'backbone/api';
export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

export const HTTP_OPTIONS_STANDARD = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'responseType': 'arraybuffer'
  })
};
// tslint:disable-next-line:no-namespace
export namespace AppConstants {
}
