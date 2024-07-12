import { Injectable } from '@angular/core';
import { Customer } from 'app/_interfaces/customer';
import { NgxIndexedDBService, DBConfig } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
  
})
export class IndexedDbService {
  dbCustomersTableName: string = 'customers';

  constructor(
    private dbService: NgxIndexedDBService
  ) {}

  addCustomer(data: Customer){
    this.dbService.add(this.dbCustomersTableName, data).subscribe({
      next: (data) => {
        console.log('adicionado com sucesso', data);
        console.log(this.get());
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  get(){
    return this.dbService.getAll(this.dbCustomersTableName);   
  }

  delete(id: number){
    this.dbService.delete(this.dbCustomersTableName, id).subscribe(
      () => {
          console.log("participante removido do indexedDb");
      },
      (error:any) => {
          console.log(error);
      }
    );
  }

  getByIndex(id: number){
    this.dbService.getByKey(this.dbCustomersTableName, id).subscribe(
      (participant:any) => {
          return participant;
      },
      (error:any) => {
          console.log(error);
      }
  );
  }
  
  count(){
    this.dbService.count('customers').subscribe(
      (peopleCount:any) => {
          console.log(peopleCount);
      },
      (error:any) => {
          console.log(error);
      }
    );
  }
}
