import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="/assets/images/DITEL.png" width="30" height="30" />
                <span>SISCONF</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="toggleUserMenu()">
                        <i class="pi pi-user"></i>
                        <span>User</span>
                    </button>
                    <div *ngIf="showUserMenu" class="user-menu">
                        <div class="user-info">
                            <span>{{ userName }}</span>
                        </div>
                        <button type="button" class="layout-topbar-action" (click)="logout()">
                            <i class="pi pi-sign-out"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    styles: [`
        .user-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--surface-0);
            border: 1px solid var(--surface-border);
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            color: var(--text-color);
            z-index: 1050; /* Ensure the menu is on top */
            background-color: var(--surface-0); /* Ensure the background is not transparent */
            opacity: 1; /* Ensure full opacity */
        }
        .user-info {
            margin-bottom: 10px;
        }
        .layout-topbar-logo span {
            color: var(--text-color);
        }
        .layout-topbar-actions .layout-topbar-action {
            color: var(--text-color);
        }
    `]
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    showUserMenu = false;
    userName = 'User Name'; // Default value

    constructor(public layoutService: LayoutService, private router: Router) {}

    ngOnInit() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userName = user.email || 'User Name';
            }
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    }

    logout() {
        const auth = getAuth();
        signOut(auth).then(() => {
            this.router.navigate(['']);
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }
}
