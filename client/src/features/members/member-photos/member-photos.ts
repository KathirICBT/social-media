import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { ServerError } from '../../../shared/errors/server-error/server-error';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService); // edit protected 13/11/2025 - 01
  protected accountService = inject(AccountService);
  protected route = inject(ActivatedRoute);
  // protected photos$?: Observable<Photo[]>;
  protected photos = signal<Photo[]>([]); // 13/11/2025
  protected loading = signal(false);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      // this.photos$ = this.memberService.getMemberPhotos(memberId); // edit 13/11/2025
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.upLoadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [photo, ...photos]);
        if (!this.memberService.member()?.imageUrl) {
          this.setMainLocalPhoto(photo);
        }
      },
      error: (err) => {
        console.log('Error uploading photo', err);
        this.loading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      },
      error: (err) => {
        console.log('Error setting main photo', err);
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((p) => p.id !== photoId));
      },
      error: (err) => {
        console.log('Error deleting photo', err);
      },
    });
  }

  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(
      (member) =>
        ({
          ...member,
          imageUrl: photo.url,
        } as Member)
    );
  }
}
