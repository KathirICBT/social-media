import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  // membersFromHome = input.required<User[]>(); // 03.10.2025 - 02
  cancelRegister = output<boolean>(); // EventEmitter<boolean> = new EventEmitter<boolean>();
  protected creds = {} as RegisterCreds;

  register() {
    // console.log(this.creds);
    this.accountService.register(this.creds).subscribe({
      next: (response) => {
        console.log(response); // 03.10.2025 - 02 - console.log membersFromHome
        this.cancel(); // close the register form
      },
      error: (error) => console.error(error),
    });
  }

  cancel() {
    // console.log('cancelled!');
    this.cancelRegister.emit(false);
  }
}

// ng g c features/members/member-list --dry-run
// ng g c features/members/member-detailed
// ng g c features/lists
// ng g c features/messages
