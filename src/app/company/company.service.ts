/**
 * @file company.service.ts
 * This file defines a service for interacting with the company-related endpoints of the job backend service.
 */

import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import { HttpClient } from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {CompanyCollection} from "./company.model";

/**
 * @class CompanyService
 * @extends {ServiceTemplate}
 *
 * This class provides methods for interacting with the company-related endpoints of the job backend service.
 * It extends the ServiceTemplate class, which provides a basic template for services.
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyService extends ServiceTemplate {

  /**
   * @private
   * @type {HttpClient}
   * An instance of HttpClient for making HTTP requests.
   */
  private httpClient: HttpClient = inject(HttpClient);

  /**
   * @private
   * @type {string}
   * The base URL for the company-related endpoints of the job backend service.
   */
  private CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/companies`;

  constructor() {
    super();
  }

  /**
   * @public
   * @method getCompanies
   * @param {boolean} includeInactive - A flag indicating whether to include inactive companies in the response.
   * This method sends a GET request to the job backend service to retrieve a list of companies.
   * If the includeInactive parameter is true, the response will include inactive companies.
   * If an error occurs during the request, it will be caught and handled by the handlerError method of the ServiceTemplate class.
   *
   * @returns {Observable<any>} An Observable that will emit the response from the server.
   */
  getCompanies(includeInactive: boolean): Observable<any> {
    return this.httpClient.get<CompanyCollection>(`${this.CONTEXT_PATH}?includeInactive=${includeInactive}`,
      HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }

}
