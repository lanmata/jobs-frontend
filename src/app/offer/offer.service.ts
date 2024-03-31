import {inject, Injectable} from '@angular/core';
import {ServiceTemplate} from "@shared/services/service-template";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {NewOfferRequest, Offer} from "./offer.model";
import {GeneralResponse} from "@shared/model/general-response.model";

/**
 * OfferService is a service that extends the ServiceTemplate.
 * It is used to interact with the job offers backend service.
 *
 * @Injectable marks it as a service that can be injected into other classes.
 */
@Injectable({
  providedIn: 'root'
})
export class OfferService extends ServiceTemplate {

  /**
   * httpClient is an instance of HttpClient.
   * It is used to make HTTP requests.
   */
  private httpClient: HttpClient = inject(HttpClient);

  /**
   * CONTEXT_PATH is the base URL for the job offers backend service.
   */
  private CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/job-offers`;

  /**
   * The constructor calls the parent class's constructor.
   */
  constructor() {
    super();
  }

  /**
   * @public
   * @method getOffers
   * getOffers is a method that sends a GET request to the job offers backend service.
   * It returns an Observable that will emit the response from the backend service.
   *
   * @returns An Observable that emits the response from the backend service.
   */
  getOffers(): Observable<any> {
    return this.httpClient.get<Offer>(`${this.CONTEXT_PATH}/collection`, HTTP_OPTIONS)
      .pipe(catchError(this.handlerError));
  }

  /**
   * @public
   * @method postOffer
   * postOffer is a method that sends a POST request to the job offers backend service.
   * It returns an Observable that will emit the response from the backend service.
   *
   * @param offer An instance of Offer.
   * @returns An Observable that emits the response from the backend service.
   */
  postOffer(offer: NewOfferRequest): Observable<any> {
    return this.httpClient.post<GeneralResponse>(this.CONTEXT_PATH, offer, HTTP_OPTIONS)
      .pipe(catchError(this.handlerError));
  }
}
