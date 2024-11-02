import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import { HttpClient } from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {Observable} from "rxjs";
import {PositionCollection} from "./position.model";
import {catchError} from "rxjs/operators";

/**
 * PositionService is a service that extends the ServiceTemplate.
 * It is used to interact with the backend service to perform operations related to positions.
 *
 * @Injectable marks it as a service that can be injected into other classes.
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService extends ServiceTemplate {

  /**
   * An instance of HttpClient which is used to make HTTP requests.
   */
  private readonly httpClient: HttpClient = inject(HttpClient);

  /**
   * The base URL for the backend service related to positions.
   */
  private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/positions`;

  constructor() {
    super();
  }

  /**
   * Fetches a collection of positions from the backend service.
   *
   * @param includeInactive - A boolean value to determine whether to include inactive positions.
   * @returns An Observable that contains a collection of positions.
   */
  getPositions(includeInactive: boolean): Observable<any> {
    return this.httpClient.get<PositionCollection>(`${this.CONTEXT_PATH}?includeInactive=${includeInactive}`,
      HTTP_OPTIONS).pipe(catchError(this.handlerError));
  }
}
