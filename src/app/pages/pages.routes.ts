import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { AuthGuard } from './auth/auth.guard';

export default [
    { path: 'crud', component: Crud, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
