import { Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { AddCustomerComponent } from './pages/add-customer/add-customer.component';

export const routes: Routes = [
    {
        path: '',
        component: CustomerListComponent
    },
    {
        path: 'addCustomer',
        component: AddCustomerComponent
    }
];
