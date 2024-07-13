import { Injectable } from '@angular/core';
import { Customer } from 'app/_interfaces/customer';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
  
})
export class IndexedDbService {
  dbCustomersTableName: string = 'customers';

  constructor(
    private dbService: NgxIndexedDBService
  ) {}

  addCustomer(data: Customer) : Promise<boolean|object>{
    return new Promise((resolve, reject) => {
      this.dbService.add(this.dbCustomersTableName, data).subscribe({
        next: () => {
          resolve(true);
        },
        error: (error:any) => {
          console.error("Erro ao tentar salvar os dados do cliente: ", error)
          
          if(error.target.error.message && error.target.error.code == 0){
            const regex = /'([^']+)'/g;
            const matches = error.target.error.message.match(regex);
            const words = matches.map((match:Array<string>) => match.slice(1, -1));
            reject({ field: words[0], fieldIsRequired: true });
          }
          reject(false);
        }
      });
    })
  }

  get(){
    return this.dbService.getAll(this.dbCustomersTableName);   
  }

  delete(id: number): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.dbService.delete(this.dbCustomersTableName, id).subscribe({
        next: () => {
          resolve(true)
        },
        error: () => {
          reject(false)
        }
      });
    })
  }

  getByIndex(id: number){
    this.dbService.getByKey(this.dbCustomersTableName, id).subscribe({
      next: (participant:any) => {
          return participant;
      },
      error: (error:any) => {
          console.log(error);
      }
    });
  }
}
