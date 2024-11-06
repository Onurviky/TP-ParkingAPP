import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {
  auth = inject(AuthService) 

  estacionamientos(): Promise<Estacionamiento[]>{
    return fetch('http://localhost:4000/estacionamientos',{
      method: 'GET',
      headers:{
        Authorization: "Bearer " + (this.auth.getToken()?? ''),
      },
    }).then(r => r.json());
  }

  buscarEstacionamientoActivo(cocheraID: number): Promise<Estacionamiento | null> {
    return this.estacionamientos().then(estacionamientos => {
      let buscado = null;
      for(let estacionamiento of estacionamientos){
        if (estacionamiento.idCochera === cocheraID && 
            estacionamiento.horaEgreso === null){
          buscado = estacionamiento;
        }
      }    
      return buscado;
    });
  }

  estacionarAuto(patente: string, idCochera: number) {
    return fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken()?? ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        patente: patente,
        idCochera: idCochera,
        idUsuareoIngreso: "ADMIN"
      })
    }).then(r => r.json());
  }

  getEstacionamientoId(idEstacionamiento: number): Promise<Estacionamiento[]> {
    return fetch(`http://localhost:4000/estacionamientos/${idEstacionamiento}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? "")
      },
    }).then(r => r.json());
  }

  abrirEstacionamiento(patente: string, idCochera: number): Promise<Estacionamiento> {
    return fetch("http://localhost:4000/estacionamientos/abrir", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ""),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patente: patente, 
        idCochera: idCochera, 
        idUsuareoIngreso: "admin",
      })
    }).then(r => {
      if (!r.ok) {
        throw new Error('Error al abrir estacionamiento');
      }
      return r.json();
    });
  }

  cerrarEstacionamiento(patenteAuto: string, cocheraId: number) {
    return fetch("http://localhost:4000/estacionamientos/cerrar", { 
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ""),
        "content-type": "application/json"
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idUsuarioIngreso: "admin"
      })
    });
  }
}

