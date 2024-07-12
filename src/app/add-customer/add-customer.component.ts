import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { NgxMaskDirective } from 'ngx-mask';

import { TypePerson } from 'app/_enums/type-person';
import { CustomerService } from '@services/customer.service';
import { Address } from 'app/_interfaces/address';
import { IndexedDbService } from '@services/indexed-db.service';
import { Customer } from 'app/_interfaces/customer';

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
    private customerService: CustomerService,
    private indexedDbService: IndexedDbService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      cnpj: new FormControl('', [
        Validators.required,
        Validators.minLength(14),
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
      //exibir "CEP inválido" no campo
    }
    
    this.customerService.getAddressByZipcode(zipcode).then((data: Address) => {
      console.warn("data", data)
      this.customerForm.patchValue({
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        phone: data.ddd + ")"
      });

      this.disableAddressFields();
      this.phoneInput.nativeElement.focus();
    });
  }

  disableAddressFields(){
    this.customerForm.get('address')?.disable();
    this.customerForm.get('neighborhood')?.disable();
    this.customerForm.get('city')?.disable();
  }

  enableAddressFields(){
    this.customerForm.get('address')?.enable();
    this.customerForm.get('neighborhood')?.enable();
    this.customerForm.get('city')?.enable();
  }

  getTypePersonEnum(): typeof TypePerson {
    return TypePerson;
  }

  saveCustomer(){
    this.enableAddressFields();

    if(!this.customerForm.valid){
      this.customerForm.markAllAsTouched();
    }
    console.warn("form", this.customerForm)

    return 

    /*
      1) preciso validar se todas as informações estão presentes
        - exibir erro se não estiver presente.

      2) Verificar se phone, email, cpf e cnpj não existem no indexDB ou tentar pegar o erro ao tentar salvar.
        - exibir erro no campo igual
    */
    
    const dataForm = this.customerForm.value;
    
    const data: Customer = {
      typePerson: this.typePerson,
      cpf_cnpj: this.typePerson === TypePerson.Fisica ? dataForm.cpf : dataForm.cnpj,
      name: this.typePerson === TypePerson.Fisica ? dataForm.name : dataForm.fantasyName,
      email: dataForm.email,
      phone: dataForm.phone,
      address: {
        cep: dataForm.zipcode,
        logradouro: dataForm.address,
        localidade: dataForm.city,
        bairro: dataForm.neighborhood
      }
    }

    this.askToContinueSaveCustomer().then((response:any) => {
      if (response.isConfirmed) {
        this.indexedDbService.addCustomer(data);
        
        Swal.fire({
          title: "Perfeito!",
          text: "Cliente salvo com sucesso!.",
          icon: "success"
        });

        this.router.navigate(['/']);
      }
    })
  }

  askToContinueSaveCustomer(){
    return new Promise((resolve) => {
      Swal.fire({
        title: "Atenção",
        text: "Tem certeza que deseja salvar este cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Salvar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        return resolve(result)
      });
    })
  }
}
