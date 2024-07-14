import { DBConfig } from "ngx-indexed-db";

export const dbConfig: DBConfig  = {
    name: 'test-soft-ti',
    version: 1,
    objectStoresMeta: [{
        store: 'customers',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'type_person', keypath: 'type_person', options: { unique: false } },
            { name: 'cpf_cnpj', keypath: 'cpf_cnpj', options: { unique: true } },
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'email', keypath: 'email', options: { unique: true } },
            { name: 'address', keypath: 'address', options: { unique: false } },
            { name: 'phone', keypath: 'phone', options: { unique: false } },
        ]
    }]
};