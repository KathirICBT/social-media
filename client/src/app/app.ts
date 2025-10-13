import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../layout/nav/nav';
// import { AccountService } from '../core/services/account-service';
import { User } from '../types/user';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // export class App implements OnInit {
  // 02.10.2025 - 02
  // private accountService = inject(AccountService);
  protected router = inject(Router); // inject Router service
  // private http = inject(HttpClient);
  // protected readonly title = signal('Social Media App');
  // protected members: any;
  // protected members = signal<any>([]);
  //03.10.2025 - 01
  // protected members = signal<User[]>([]);

  // constructor(private http: HttpClient) {} // Alternative way to inject HttpClient

  // ngOnInit(): void {
  //   // Lifecycle hook to perform initialization logic after component construction
  //   this.http.get<{ title: string }>('http://localhost:5016/api/members').subscribe({
  //     next: (response) => {
  //       this.title.set(response.title); // Update the title signal with the response from the API
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //     complete: () => {
  //       console.log('Request completed');
  //     },
  //   }); // Make an HTTP GET request to the '/api/members' endpoint
  // }

  // CONSOLE OUTPUT AND CORS CHECK ==========================================================================================

  // ngOnInit(): void {
  //   this.http.get('http://localhost:5016/api/members').subscribe({
  //     next: (response) => console.log(response),
  //     error: (error) => console.error(error),
  //     complete: () => console.log('Request the http completed'), // Log when the request is completed. unsubscribe is used to execute the observable
  //   }); // Make an HTTP GET request to the '/api/members/3' endpoint
  // }

  // Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. This is done to prevent malicious websites from accessing sensitive data on other domains without permission.
  // CORS (Cross-Origin Resource Sharing) என்பது ஒரு security mechanism. It allows web applications running at one origin (domain) to make requests to resources on a different origin.

  // =========================================================================================================================

  // PAGE OUTPUT WITHOUT SIGNAL ==============================================================================================

  // ngOnInit(): void {
  //   this.http.get('http://localhost:5016/api/members').subscribe({
  //     next: (response) => (this.members = response),
  //     error: (error) => console.error(error),
  //     complete: () => console.log('Request the http completed'), // Log when the request is completed. unsubscribe is used to execute the observable
  //   }); // Make an HTTP GET request to the '/api/members/3' endpoint
  // }

  // =========================================================================================================================

  // PAGE OUTPUT WITH SIGNAL ================================================================================================
  // ngOnInit(): void {
  //   this.http.get('http://localhost:5016/api/members').subscribe({
  //     next: (response) => this.members.set(response),
  //     error: (error) => console.error(error),
  //     complete: () => console.log('Request the http completed'), // Log when the request is completed. unsubscribe is used to execute the observable
  //   }); // Make an HTTP GET request to the '/api/members/3' endpoint
  // }

  // =========================================================================================================================

  // async ngOnInit() {
  //   this.members.set(await this.getMembers());
  //   // this.setCurrentUser();
  // }

  // setCurrentUser() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   this.accountService.currentUser.set(user);
  // }

  // async getMembers() {
  //   try {
  //     // const response = await lastValueFrom( this.http.get('http://localhost:5016/api/members'));
  //     // this.members.set(response);
  //     return lastValueFrom(this.http.get<User[]>('http://localhost:5016/api/members'));
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
}

// need to configer path (./src/layout/nav/nav.ts) in angular.json

// ng g c nav  --skip-tests --dry-run // to generate a new component named 'nav' without creating the test file.
// ng g c layout/nav --dry-run // to see what will be generated without actually creating the files. --dry-run is useful for previewing the changes before applying them.
// ng g c layout/nav --skip-tests --dry-run // to generate a new component named 'nav' inside the 'layout' folder without creating the test file.
