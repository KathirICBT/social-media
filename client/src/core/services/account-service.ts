import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null); // signal to hold the current user state, Union type User or null

  // baseUrl = 'http://localhost:5016/api/';
  private baseUrl = environment.apiUrl;

  // REGISTER METHOD
  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user); // call setCurrentUser method
        }
      })
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user)); // store user in local storage
          // this.currentUser.set(user);
          this.setCurrentUser(user); // call setCurrentUser method
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user)); // store user in local storage
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user'); // remove user from local storage
    localStorage.removeItem('filters'); // remove token from local storage
    this.currentUser.set(null);
  }
}
