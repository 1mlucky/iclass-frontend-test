import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { mockApiInterceptor } from './mock-api/mock-api.interceptor';
import { MOCK_API_DEFAULT_DELAY } from './mock-api/mock-api.constants';
import { mockApiServices } from './mock-api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideRouter(appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
        ),
        {
            provide : MOCK_API_DEFAULT_DELAY,
            useValue: 100,
        },
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        {
            provide   : APP_INITIALIZER,
            deps      : [...mockApiServices],
            useFactory: () => (): any => null,
            multi     : true,
        },
    ],
};
