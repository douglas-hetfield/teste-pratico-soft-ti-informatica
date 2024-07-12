import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { IndexedDbService } from '@services/indexed-db.service';
import { Customer } from 'app/_interfaces/customer';

@Component({
	selector: 'app-customer-list',
	standalone: true,
	imports: [
		DecimalPipe,
		FormsModule,
		NgbTypeaheadModule,
		NgbPaginationModule,
		RouterModule,
		CommonModule
	],
	templateUrl: './customer-list.component.html',
	styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
	page = 1;
	pageSize = 10;
	customersLength: number = 0;
	customers: any;

	constructor(
		private indexedDbService: IndexedDbService
	) {
		this.getAllCustomers();
	}

	getAllCustomers() {
		this.indexedDbService.get().subscribe({
			next: (data) => {
				console.warn("Customers", data)
				this.customers = data;
				this.customersLength = this.customers.length;

				this.customers = data.slice(
					(this.page - 1) * this.pageSize,
					(this.page - 1) * this.pageSize + this.pageSize,
				);
			},
			error: (error) => {
				console.warn("Erro ao buscar clientes!", error)
			}
		})
		
		/*this.countries = COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);*/
	}
}
