import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import { HttpClient } from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {SourceCollection} from "./source.model";

@Injectable({
  providedIn: 'root'
})
export class SourceService extends ServiceTemplate {

  /**
   * An instance of HttpClient which is used to make HTTP requests.
   */
  private readonly httpClient: HttpClient = inject(HttpClient);

  /**
   * The base URL for the backend service related to sources.
   */
  private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/sources`;

  constructor() {
    super();
  }

  /**
   * Fetches a collection of sources from the backend service.
   *
   * @param includeInactive - A boolean value to determine whether to include inactive sources.
   * @returns An Observable that contains a collection of sources.
   */
  getSources(includeInactive: boolean): Observable<any> {
    return this.httpClient.get<SourceCollection>(`${this.CONTEXT_PATH}?includeInactive=${includeInactive}`,
      HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }
}
