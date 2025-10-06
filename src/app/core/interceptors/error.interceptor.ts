import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(source => new Observable(subscriber => {
    source.subscribe({
      next: v => subscriber.next(v),
      error: (err: HttpErrorResponse) => {
        const body = err.error;
        if (body?.message) {
          if (Array.isArray(body.errors) && body.errors.length) {
            const list = body.errors.map((e: any) => `<li>${e.field}: ${e.message}</li>`).join('');
            Swal.fire('Erro', `${body.message}<ul>${list}</ul>`, 'error');
          } else {
            Swal.fire('Erro', body.message, 'error');
          }
        } else {
          Swal.fire('Erro', 'Falha inesperada no servidor', 'error');
        }
        subscriber.error(err);
      },
      complete: () => subscriber.complete()
    });
  }));
};
