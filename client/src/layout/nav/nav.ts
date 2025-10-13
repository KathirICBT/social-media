import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService); // inject service
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected creds: any = {};
  // protected loggedIn = signal(false);

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
