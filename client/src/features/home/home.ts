import { Component, Input, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // @Input({ required: true }) membersFormApp: User[] = []; // 03.10.2025 - 02
  protected registerMode = signal(false);

  showRegister(value: boolean) {
    // this.registerMode.set(true);
    this.registerMode.set(value);
  }
}

// ng g c features/account/register --dry-run
// ng g c features/account/register --skip-tests --flat --project=client
// ng g c features/home --skip-tests --flat --project=client
// ng g c features/home --skip-tests --project=client
// ng g c features/home --project=client
