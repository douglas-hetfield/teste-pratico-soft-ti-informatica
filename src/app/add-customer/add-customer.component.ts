import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import Swal from 'sweetalert2';

import { TypePerson } from 'app/_enums/type-person';
import { CustomerService } from '@services/customer.service';
import { Address } from 'app/_interfaces/address';
import { IndexedDbService } from '@services/indexed-db.service';
import { Customer } from 'app/_interfaces/customer';
import { cpfValidator } from 'app/_utils/cpfValidator';
import { cnpjValidator } from 'app/_utils/cnpjValidator';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  customerForm!: FormGroup;
  optionsTypePerson = Object.values(TypePerson);
  typePerson: TypePerson = TypePerson.Fisica;

  @ViewChild('phone', { static: false }) phoneInput!: ElementRef;
  @ViewChild('zipcode', { static: false }) zipcodeInput!: ElementRef;

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
        Validators.maxLength(14),
        cnpjValidator()
      ]),
      fantasyName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9À-ÖØ-öø-ÿ\s&-]+$/)
      ]),
      cpf: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        cpfValidator()
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/)
      ]),

      zipcode: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
      address: new FormControl('', [
        Validators.required,
      ]),
      neighborhood: new FormControl('', [
        Validators.required,
      ]),
      city: new FormControl('', [
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]),
    });
  }

  onTypePersonChange(event: Event) : void {
    this.typePerson = (event.target as HTMLSelectElement).value as TypePerson;
  }

  async onZipcodeChange(): Promise<void>{
    const zipcode = this.customerForm.get('zipcode')?.value;
    if(zipcode.length < 8){
      return;
    }
    this.customerService.getAddressByZipcode(zipcode).then((data: Address | any) => {
      if(data.erro){
        Swal.fire({
          title: "Erro ao buscar endereço",
          text: "Digite um CEP válido!",
          icon: "error"
        }).finally(() => {
          this.customerForm.patchValue({
            zipcode: ''
          });
          this.zipcodeInput.nativeElement.focus();
        });

        return;
      }

      this.customerForm.patchValue({
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        phone: data.ddd + ")"
      });

      this.disableFields(['address', 'neighborhood', 'city'])
      this.phoneInput.nativeElement.focus();
    });
  }

  disableFields(fields: string[]): void {
    fields.forEach(field => this.customerForm.get(field)?.disable());
  }

  enableFields(fields: string[]): void {
    fields.forEach(field => this.customerForm.get(field)?.enable());
  }

  getTypePersonEnum(): typeof TypePerson {
    return TypePerson;
  }

  saveCustomer(): void{
    //check the type of person and disable fields that will not be necessary for validation
    if(this.typePerson === TypePerson.Fisica){
      this.disableFields(['fantasyName', 'cnpj']);
    }else{
      this.disableFields(['name', 'cpf']);
    }
    
    if (!this.customerForm.valid){
      this.customerForm.markAllAsTouched()
      Swal.fire({
        title: "Atenção",
        confirmButtonColor: "#0d6efd",
        text: "Por favor, corrija os erros do formulário antes de enviar!",
        icon: "error"
      });

      this.enableFields(['name', 'cpf', 'fantasyName', 'cnpj']);
      return;
    }
    
    this.enableFields(['address', 'neighborhood', 'city', 'name', 'cpf', 'fantasyName', 'cnpj'])
    
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

    this.askToContinueSaveCustomer().then((response: {isConfirmed:boolean}) => {
      if (response.isConfirmed) {
        this.indexedDbService.addCustomer(data).then((response: boolean | object) => {
          if(response){
            Swal.fire({
              title: "Perfeito!",
              text: "Cliente salvo com sucesso!.",
              icon: "success"
            });
    
            this.router.navigate(['/']);
          }else{
            Swal.fire({
              title: "Erro",
              text: "Erro ao tentar salvar cliente :(",
              icon: "error"
            });
          }
        }).catch((error: { field:string, fieldIsRequired:boolean }) => {
          console.error("erro mensage: ", error)

          let erroMessage = 'Erro ao tentar salvar cliente na base de dados.';
          if(error.field){
            erroMessage = this.getErrorMessage(error.field);
          }

          Swal.fire({
            title: "Erro",
            text: erroMessage,
            icon: "error"
          });
        })
        
      }
    })
  }

  getErrorMessage(field:string) : string{
    switch(field){
      case 'cpf_cnpj':
        if(this.typePerson === TypePerson.Fisica){
          return 'Este CPF já está salvo na base de dados!'
        }else{
          return 'Este CNPJ já está salvo na base de dados!'
        }
        
      case 'email':
        return 'Este email já foi salvo na base de dados!'
        
      case 'phone':
        return 'Este telefone já foi salvo na base de dados!'

      default:
        return 'Erro ao tentar salvar cliente na base de dados.'
    }
  }

  askToContinueSaveCustomer(): Promise<{isConfirmed:boolean}>{
    return new Promise((resolve) => {
      Swal.fire({
        title: "Atenção",
        text: "Tem certeza que deseja salvar este cliente?",
        icon: "warning",
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Salvar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        return resolve(result)
      });
    })
  }
}
