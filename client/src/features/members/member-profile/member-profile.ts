import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  // EDIT =======================================
  private accountService = inject(AccountService); // 10/11/2025
  protected memberService = inject(MemberService); // 01
  protected editableMember: EditableMember = {
    displayName: '',
    city: '',
    country: '',
    description: '',
  }; // when create edit from member data
  @ViewChild('editForm') editForm?: NgForm; // to access form state for unsaved changes guard
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private toast = inject(ToastService);
  //=============================================

  // private route = inject(ActivatedRoute);
  // protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    // this.route.parent?.data.subscribe((data) => {
    //   this.member.set(data['member']);
    // });

    // EDIT =======================================
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
      description: this.memberService.member()?.description || '',
    };
    //=============================================
  }

  // EDIT =======================================
  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember };
    // console.log('Updated Member:', updatedMember);
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        // Update current user display name if changed nav bar (10/11/2025)
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser); // 10/11/2025
        }
        // ================================================================
        this.toast.success('Profile updated successfully!'); // 01
        this.memberService.editMode.set(false); // reset edit mode // 01
        this.memberService.member.set(updatedMember as Member); // update member signal // 02
        this.editForm?.reset(updatedMember); // reset form state dirty/pristine // 01
      },
    });
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false); // reset edit mode
    }
  }
  //=============================================
}
