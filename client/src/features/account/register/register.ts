import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  // imports: [FormsModule],
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private fb = inject(FormBuilder); // 21/11/2025
  cancelRegister = output<boolean>(); // EventEmitter<boolean> = new EventEmitter<boolean>();
  protected creds = {} as RegisterCreds;
  // 18/11/2025 - 01 ========================================
  protected credentialsForm: FormGroup;
  // 21/11/2025 - 01 ========================================
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]], // 19/11/2025 - 01
    });

    // 21/11/2025 - 01 ========================================
    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });

    // 19/11/2025 - 01 ========================================
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

    // ========================================================
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }
  // ========================================================

  // 21/11/2025 - 01 ========================================
  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  previousStep() {
    this.currentStep.update((prevStep) => prevStep - 1);
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    // 21/11/2025 - 01 ========================================
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };
      // console.log('Form Data: ', formData);
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
          // this.cancel(); // close the register form
        },
        error: (error) => {
          console.log('Error: ', error);
          this.validationErrors.set(error);
        },
      });
    }
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
