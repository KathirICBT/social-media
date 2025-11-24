import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService); // inject service
  protected busyService = inject(BusyService); // inject service for loading spinner 11/11/2025
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected creds: any = {};
  // protected loggedIn = signal(false);
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur(); // remove focus from button after click
    }
    //elem?.blur(); // remove focus from button after click
  }

  login() {
    // console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        this.router.navigateByUrl('/members'); // navigate to members page after login
        this.toastService.success('Login successfully');
        console.log(result);
        // this.loggedIn.set(true);
        this.creds = {}; // clear form
      },
      error: (error) => {
        this.toastService.error(error.error);
      },
    });
  }

  logout() {
    // this.loggedIn.set(false);
    this.accountService.logout();
    this.router.navigateByUrl('/'); // navigate to home page after logout
    this.toastService.info('Logout successfully');
  }

  // go to daisyui.com to get more components for dropdown, navbar, button, form ...
}

// need to configer services path (./src/core/services/service.ts) in angular.json

// ng g s account-service --dry-run
// ng g s account-service
// ng g s account-service --skip-tests --flat --project=client

// ===============================================================

// ng g c features/home --dry-run

// ng g s toast-service --dry-run

// ng g guard auth --dry-run
// ng g g auth --dry-run

// angular.json settings for guard path
// VS Code settings compact folders - *
