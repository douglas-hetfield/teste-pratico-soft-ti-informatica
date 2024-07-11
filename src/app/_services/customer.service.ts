import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  constructor(
    private http: HttpClient,
  ) { }

  getAddressByZipcode(zipcode: string){
    return fetch(`${environment.viaCepUrl}${zipcode}/json`).then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao executar a requisição: ' + response.status);
      }

      return response.json();
    })
  }
}
