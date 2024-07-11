import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TypePerson } from 'app/_enums/type-person';
import { NgxMaskDirective } from 'ngx-mask';
import { CustomerService } from '@services/customer.service';
import { lastValueFrom, Observable } from 'rxjs';
import { Address } from 'app/_interfaces/address';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  customerForm!: FormGroup;
  optionsTypePerson = Object.values(TypePerson);
  typePerson: TypePerson = TypePerson.Fisica;

  @ViewChild('phone', { static: false }) phoneInput!: ElementRef;

  constructor(
    private customerService: CustomerService
  ){}

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      cnpj: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      fantasyName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      
      cpf: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),

      zipcode: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      neighborhood: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  onTypePersonChange(event: Event) : void {
    this.typePerson = (event.target as HTMLSelectElement).value as TypePerson;
  }

  async onZipcodeChange(){
    const zipcode = this.customerForm.get('zipcode')?.value;
    if(zipcode.length < 8){
      //return "CEP inválido"
    }
    
    this.customerService.getAddressByZipcode(zipcode).then((data: Address) => {
      console.warn("data", data)
      this.customerForm.patchValue({
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        phone: data.ddd + ")"
      });

      this.customerForm.get('address')?.disable();
      this.customerForm.get('neighborhood')?.disable();
      this.customerForm.get('city')?.disable();

      this.phoneInput.nativeElement.focus();
    });
  }

  getTypePersonEnum(): typeof TypePerson {
    return TypePerson;
  }

  saveCustomer(){
    
  }
}
