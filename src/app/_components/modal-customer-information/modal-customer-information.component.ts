import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskPipe } from 'ngx-mask';

import { TypePerson } from 'app/_enums/type-person';
import { Customer } from 'app/_interfaces/customer';

@Component({
  selector: 'app-modal-customer-information',
  standalone: true,
  imports: [
		NgxMaskPipe,
		NgbTypeaheadModule,
		FormsModule,
		CommonModule,
  ],
  templateUrl: './modal-customer-information.component.html',
  styleUrl: './modal-customer-information.component.css'
})
export class ModalCustomerInformationComponent {
  @Input() selectedCustomer!: Customer;

  constructor(
    public activeModal: NgbActiveModal
  ){}

  getTypePersonEnum(): typeof TypePerson {
		return TypePerson;
	}
}
