import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import { IndexedDbService } from '@services/indexed-db.service';
import { Customer } from 'app/_interfaces/customer';
import { CustomersTableComponent } from '@components/customers-table/customers-table.component';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-customer-list',
	standalone: true,
	imports: [
		RouterModule,
		CustomersTableComponent
	],
	templateUrl: './customer-list.component.html',
	styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
	page: number = 1;
	pageSize: number = 10;
	customersLength: number = 0;
	customers: Customer[] | any = [];

	constructor(
		private indexedDbService: IndexedDbService
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

	changePageSize(pageSize: number){
		this.pageSize = pageSize;
		this.getAllCustomers();
	}

	changePage(page: number){
		this.page = page;
		this.getAllCustomers();
	}

	deleteCustomer(customer: Customer): void{
		this.askToContinueDeleteCustomer().then((response: {isConfirmed:boolean}) => {
			if(!customer.id || !response.isConfirmed) return ;
			
			this.indexedDbService.delete(customer.id).then(() => {
				this.customers = this.customers.filter((data: Customer) => data.id != customer.id);

				Swal.fire({
					title: "Perfeito!",
					text: "Cliente excluído com sucesso!",
					icon: "success"
				});
			}).catch(() => {
				Swal.fire({
					title: "Erro Interno",
					text: "Erro ao tentar excluir cliente!",
					icon: "error"
				});
			})
		})
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
}
