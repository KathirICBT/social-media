import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  // private memberService = inject(MemberService);
  // EDIT =======================================
  private accountService = inject(AccountService); // 01
  protected memberService = inject(MemberService); // 02 - A editMode
  //=============================================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // protected member$?: Observable<Member>; // Method 1: using observable
  // protected member = signal<Member | undefined>(undefined); // Method 2: using signal. 09.11.2025 But better to load in member service to share state across components
  protected title = signal<string | undefined>('Profile');

  // EDIT =======================================
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  }); // 01
  //=============================================

  ngOnInit(): void {
    // this.member$ = this.loadMember(); // Method 1: using observable
    // this.route.data.subscribe({
    //   next: (data) => {
    //     this.member.set(data['member']);
    //   },
    // }); // Method 2: using signal. 09.11.2025 But better to load in member service to share state across components
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      },
    });
  }

  // loadMember() { // Method 1: using observable
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (!id) return;
  //   return this.memberService.getMember(id);
  // }
}
