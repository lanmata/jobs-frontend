import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import {HttpClient} from "@angular/common/http";
import {JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OfferDetailService extends ServiceTemplate {

  /**
   * httpClient is an instance of HttpClient.
   * It is used to make HTTP requests.
   */
  private httpClient: HttpClient = inject(HttpClient);

  /**
   * CONTEXT_PATH is the base URL for the job offers backend service.
   */
  private CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/job-offer-details`;

  /**
   * The constructor calls the parent class's constructor.
   */
  constructor() {
    super();
  }

  /**
   * @public
   * @method deleteOfferDetail
   * deleteOfferDetail is a method that sends a DELETE request to the job offers backend service.
   * It returns an Observable that will emit the response from the backend service.
   *
   * @returns An Observable that emits the response from the backend service.
   */
  public deleteOfferDetail(offerDetailId: string): Observable<any> {
    return this.httpClient.delete(`${this.CONTEXT_PATH}?jobOfferDetailId=${offerDetailId}`)
      .pipe(catchError(this.handlerError));
  }
}
