import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppRootComponent } from './app/app.root.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';

bootstrapApplication(AppRootComponent, {
  providers: [
  provideRouter(routes),
  provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor]))
  ]
}).catch((err: unknown) => console.error(err));
