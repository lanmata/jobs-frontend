import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {ServiceTemplate} from "@shared/services/service-template";
import {HTTP_OPTIONS_STANDARD, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";

/**
 * ReportService is a service that extends the ServiceTemplate.
 * It is used to interact with the reports backend service.
 *
 *
 * k
 * @Injectable marks it as a service that can be injected into other classes.
 */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends ServiceTemplate {

  /**
   * httpClient is an instance of HttpClient.
   * It is used to make HTTP requests.
   */
  private readonly httpClient: HttpClient = inject(HttpClient);

  /**
   * CONTEXT_PATH is the base URL for the reports backend service.
   */
  private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/job-offers/reports`;

  constructor() {
    super();
  }

  /**
   * @public
   * @method getReports
   * getReports is a method that sends a GET request to the reports backend service.
   * It returns an Observable that will emit the response from the backend service.
   *
   * @returns An Observable that emits the response from the backend service.
   */
  getReports(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.CONTEXT_PATH}?startDate=${startDate}&endDate=${endDate}`, {...HTTP_OPTIONS_STANDARD, responseType: 'arraybuffer'})
      .pipe(catchError(this.handlerError));
  }
}
