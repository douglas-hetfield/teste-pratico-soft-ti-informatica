import { Address } from "./address";

export interface Customer {
    id?: number,
    typePerson: string,
    cpf_cnpj: string,
    name: string,
    email: string,
    phone: string,
    address: Address,
}
