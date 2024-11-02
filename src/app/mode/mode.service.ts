import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {ServiceTemplate} from "@shared/services/service-template";
import {ModeCollection} from "./mode.model";

/**
 * ModeService is a service that extends the ServiceTemplate.
 * It provides methods to interact with the backend services related to 'modes'.
 *
 * @Injectable marks it as a service that can be injected into other classes.
 */
@Injectable({
  providedIn: 'root'
})
export class ModeService extends ServiceTemplate {
  // HttpClient instance to make HTTP requests.
  private readonly httpClient: HttpClient = inject(HttpClient);

  // Base URL for the backend service.
  private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/modes`;

  constructor() {
    super();
  }

  /**
   * Fetches a collection of companies from the backend service.
   *
   * @param includeInactive - If true, the returned collection will include inactive companies.
   * @returns An Observable that will emit the fetched CompanyCollection.
   * The Observable is piped with a catchError operator that will handle any errors that occur during the HTTP request.
   */
  getModes(includeInactive: boolean): Observable<any> {
    return this.httpClient.get<ModeCollection>(`${this.CONTEXT_PATH}?includeInactive=${includeInactive}`,
      HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }

}
