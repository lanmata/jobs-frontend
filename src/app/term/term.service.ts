import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import { HttpClient } from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {TermCollection} from "./term.model";

@Injectable({
  providedIn: 'root'
})
export class TermService extends ServiceTemplate {

  /**
   * An instance of HttpClient which is used to make HTTP requests.
   */
  private readonly httpClient: HttpClient = inject(HttpClient);

  /**
   * The base URL for the backend service related to term.
   */
  private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/terms`;

  constructor() {
    super();
  }

  /**
   * Fetches a collection of term from the backend service.
   *
   * @param includeInactive - A boolean value to determine whether to include inactive term.
   * @returns An Observable that contains a collection of term.
   */
  getTerm(includeInactive: boolean): Observable<any> {
    return this.httpClient.get<TermCollection>(`${this.CONTEXT_PATH}?includeInactive=${includeInactive}`,
      HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }
}
