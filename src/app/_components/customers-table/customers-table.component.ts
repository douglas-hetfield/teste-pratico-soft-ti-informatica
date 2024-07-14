import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TypePerson } from 'app/_enums/type-person';
import { Customer } from 'app/_interfaces/customer';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalCustomerInformationComponent } from '@components/modal-customer-information/modal-customer-information.component';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [
		CommonModule,
		FormsModule,
		NgbPaginationModule,
		NgbPopoverModule,
    NgbTypeaheadModule
  ],
  templateUrl: './customers-table.component.html',
  styleUrl: './customers-table.component.css'
})
export class CustomersTableComponent {
  page: number = 1;
	pageSize: number = 10;

  @Input() customers: Customer[] = [];
  @Input() customersLength: number = 0;

  @Output() deleteCustomer = new EventEmitter<Customer>();
  @Output() changePage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();

  constructor(
    private modalService: NgbModal
  ){}

  getTypePersonEnum(): typeof TypePerson {
		return TypePerson;
	}

  openModalInformation(customer: Customer): void{
		const modalRef = this.modalService.open(ModalCustomerInformationComponent, { centered: true });
    modalRef.componentInstance.selectedCustomer = customer;
	}
}
