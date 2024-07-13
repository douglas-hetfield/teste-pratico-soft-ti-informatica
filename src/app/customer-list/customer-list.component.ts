import { Component, TemplateRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { IndexedDbService } from '@services/indexed-db.service';
import { Customer } from 'app/_interfaces/customer';
import Swal from 'sweetalert2';
import { TypePerson } from 'app/_enums/type-person';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
	selector: 'app-customer-list',
	standalone: true,
	imports: [
		DecimalPipe,
		FormsModule,
		NgbTypeaheadModule,
		NgbPaginationModule,
		RouterModule,
		CommonModule,
		NgbPopoverModule,
		NgxMaskPipe
	],
	templateUrl: './customer-list.component.html',
	styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
	page: number = 1;
	pageSize: number = 10;
	customersLength: number = 0;
	customers: Customer[] | any;
	selectedCustomer: Customer | any;

	constructor(
		private indexedDbService: IndexedDbService,
		private modalService: NgbModal
	) {
		this.getAllCustomers();
	}

	getAllCustomers(): void {
		this.indexedDbService.get().subscribe({
			next: (data: Customer[] | any) => {
				this.customers = data;
				this.customersLength = this.customers.length;

				this.customers = data.slice(
					(this.page - 1) * this.pageSize,
					(this.page - 1) * this.pageSize + this.pageSize,
				);
			},
			error: () => {
				Swal.fire({
					title: "Erro Interno",
					text: "Erro ao tentar buscar clientes :(",
					icon: "error"
				});
			}
		})
	}

	deleteCustomer(customer: Customer): void{
		this.askToContinueDeleteCustomer().then((response: {isConfirmed:boolean}) => {
			if(!customer.id || !response.isConfirmed) return ;
			
			this.indexedDbService.delete(customer.id).then(() => {
				this.customers = this.customers.filter((data: Customer) => data.id != customer.id);
			}).catch(() => {
				Swal.fire({
					title: "Erro Interno",
					text: "Erro ao tentar excluir cliente!",
					icon: "error"
				});
			})
		})
	}

	openModalInformation(content: TemplateRef<any>, customer: Customer): void{
		this.selectedCustomer = customer;
		this.modalService.open(content, { centered: true });
	}

	askToContinueDeleteCustomer(): Promise<{isConfirmed:boolean}>{
		return new Promise((resolve) => {
			Swal.fire({
				title: "Atenção",
				text: "Tem certeza que deseja EXCLUIR este cliente?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#dc3545",
				cancelButtonText: "Cancelar",
				confirmButtonText: "EXCLUIR"
			}).then((result) => {
				return resolve(result)
			});
		})
	}

	getTypePersonEnum(): typeof TypePerson {
		return TypePerson;
	}
}
