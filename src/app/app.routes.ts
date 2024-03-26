import { Route } from "@angular/router";


export const appRoutes: Route[] = [
    // Redirect empty path to '/home'
    {path: '', pathMatch : 'full', redirectTo: 'home'},
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routes')
    },
];