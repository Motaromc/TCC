import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';

export default [
    { path: 'login', component: Login },
    { path: 'access', component: Access },
    { path: 'error', component: Error }
] as Routes;
