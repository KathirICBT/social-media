import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService); // inject service
  protected creds: any = {};
  // protected loggedIn = signal(false);

  login() {
    // console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        // this.loggedIn.set(true);
        this.creds = {}; // clear form
      },
      error: (error) => console.error(error.message),
    });
  }

  logout() {
    // this.loggedIn.set(false);
    this.accountService.logout();
  }

  // go to daisyui.com to get more components for dropdown, navbar, button, form ...
}

// need to configer services path (./src/core/services/service.ts) in angular.json

// ng g s account-service --dry-run
// ng g s account-service
// ng g s account-service --skip-tests --flat --project=client

// ng g c features/home --dry-run
