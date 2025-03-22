import { Injectable } from '@angular/core';
import { Observable, catchError, finalize } from 'rxjs';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.loader.isLoading.next(false);
      })
    );
  }

  constructor(public loader: LoaderService) {}
}
