import { Component, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams.set(JSON.parse(filters));
    }
  }

  open() {
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  // NEW: reset method to programmatically reset the modal's model
  // reset() {
  //   this.memberParams.set(new MemberParams());
  //   // also clear any stored filters
  //   localStorage.removeItem('filters');
  //   // if modal is open, update the form controls immediately (they are bound to the signal)
  // }

  onMinAgeChange() {
    if (this.memberParams().minAge < 18) this.memberParams().minAge = 18;
  }

  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams().maxAge = this.memberParams().minAge;
    }
  }
}
