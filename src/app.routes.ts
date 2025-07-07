import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from './app/pages/auth/login';

export const appRoutes: Routes = [
    { path: '', component: Login},
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
