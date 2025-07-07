import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="/assets/images/DITEL.png" width="30" height="30" class="mb-4 w-16 shrink-0 mx-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Sistema de Controle Funcional</div>
                            <span class="text-muted-color font-medium">Faça login para continuar</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Endereço de email" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Senha" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Lembrar-me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" (click)="onForgotPassword()">Esqueceu a senha?</span>
                            </div>
                            <p-button label="Entrar" styleClass="w-full" (click)="onSignIn()"></p-button>
                            <div *ngIf="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .text-surface-900 {
            color: var(--text-color) !important;
        }
        .dark .text-surface-0 {
            color: var(--text-color) !important;
        }
        label, input, p-password, p-checkbox, p-button, span {
            font-size: 1.25rem; /* Aumentar a fonte */
        }
    `]
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
    errorMessage: string = '';

    constructor(private router: Router) {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        if (rememberedEmail && rememberedPassword) {
            this.email = rememberedEmail;
            this.password = rememberedPassword;
            this.checked = true;
        }
    }

    onSignIn() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
                
                const user = userCredential.user;
                if (this.checked) {
                    localStorage.setItem('rememberedEmail', this.email);
                    localStorage.setItem('rememberedPassword', this.password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }
                this.router.navigate(['/pages/crud']);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.errorMessage = 'Email ou senha incorretos';
                console.error('Error signing in:', errorCode, errorMessage);
            });
    }

    onForgotPassword() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.email)
            .then(() => {
                alert('Email de redefinição de senha enviado!');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.errorMessage = 'Erro ao enviar email de redefinição de senha';
                console.error('Error sending password reset email:', errorCode, errorMessage);
            });
    }
}
