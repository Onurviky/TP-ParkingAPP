import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  constructor(private auth: AuthService) {}

  fetchEstacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener estacionamientos");
        }
        return response.json();
      });
  }
}