import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cochera';

@Injectable({
  providedIn: 'root'
})
export class CocherasService {

  auth = inject(AuthService)
  
    getCocheras() {
      return fetch("http://localhost:4000/cocheras", {//fetch que trae cocheras, id cocheras
        method: "GET",
        headers: {
          Authorization: "Bearer " + (this.auth.getToken() ?? "")
        },
      }).then(r => r.json());
    }
  
    getCocherasId(idCochera: number) {
      return fetch(`http://localhost:4000/cocheras/${idCochera}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + (this.auth.getToken() ?? "")
        },
      }).then(r => r.json());
    }
    
    eliminarCochera(idCochera: number): Promise<Response> {
      return fetch(`http://localhost:4000/cocheras/${idCochera}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
    }
  
    agregarCochera(datosCochera: { descripcion: string }): Promise<any> {
      return fetch("http://localhost:4000/cocheras/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + (this.auth.getToken() ?? '')
        },
        body: JSON.stringify(datosCochera),
      }).then(res => {
        if (!res.ok) {
          throw new Error('Error al agregar nueva fila: ' + res.statusText);
        }
        return res.json();
      });
    }
  
    habilitarCochera(cochera: Cochera) {
      return fetch(`http://localhost:4000/cocheras/${cochera.id}/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.auth.getToken()}`
        }
      });
    }
  
    deshabilitarCochera(cochera: Cochera) {
      return fetch(`http://localhost:4000/cocheras/${cochera.id}/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.auth.getToken()}`
        }
      });
    }
  
  }

