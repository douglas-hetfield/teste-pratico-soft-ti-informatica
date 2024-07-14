import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  async getAddressByZipcode(zipcode: string){
    return fetch(`${environment.viaCepUrl}${zipcode}/json`).then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao executar a requisição: ' + response.status);
      }

      return response.json();
    }).catch((error: any) => {
      console.error("ViaCepError: ", error);
    })
  }
}
