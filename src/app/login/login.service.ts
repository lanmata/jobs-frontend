import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HTTP_OPTIONS, JOB_BACKEND_SERVICE_BASE_URL} from "@shared/app.const";
import {ServiceTemplate} from "@shared/services/service-template";
import {catchError} from "rxjs/operators";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends ServiceTemplate {
    // HttpClient instance to make HTTP requests.
    private readonly httpClient: HttpClient = inject(HttpClient);

    // Base URL for the backend service.
    private readonly CONTEXT_PATH: string = `${JOB_BACKEND_SERVICE_BASE_URL}/auth/token`;

    constructor() {
        super();
    }

    getToken(user: string, password: string): Observable<any> {
        return this.httpClient.post(this.CONTEXT_PATH, {alias: user, password: password}, {...HTTP_OPTIONS, observe: 'response'})
            .pipe(map(response => {
                const headers = response.headers;
                const body = response.body;
                const sessionTokenBkd = headers.get('session-token-bkd');
                return {headers, body, sessionTokenBkd};
            }),catchError(this.handlerError));
    }

}
