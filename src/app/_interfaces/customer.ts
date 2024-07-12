import { Address } from "./address";

export interface Customer {
    typePerson: string,
    cpf_cnpj: string,
    name: string,
    email: string,
    phone: string,
    address: Address,
}
