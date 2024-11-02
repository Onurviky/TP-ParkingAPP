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
  buscarEstacionamientoActivo(chocheraID:number){
    return  this.estacionamientos().then(estacionamientos=>{
      let buscado=null;
      for(let estacionamiento of estacionamientos){
        if (estacionamiento.idCochera===chocheraID &&
          estacionamiento.horaIngreso===null){
            buscado=estacionamiento;
          }
        }    
      return buscado;
    });
  }

estacionarAuto(patente: string, idCochera:number){
  return fetch('http://localhost:4000/estacionamientos/abrir',{
    method: 'POST',
    headers:{
      Authorization: "Bearer " + (this.auth.getToken()?? ''),
    },
    body:JSON.stringify({  
      patente: patente ,
      idCochera: idCochera ,
      idUsuarioIngreso:"ADMIN"
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

abrirEstacionamiento(patente: string, idCochera: number) {
  return fetch("http://localhost:4000/estacionamientos/abrir", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + (this.auth.getToken() ?? ""),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      patente: patente, 
      idCochera: idCochera, 
      idUsuarioIngreso: "admin",
    })
  }).then(r => r.json());
}

cerrarEstacionamiento(patente: string, idCochera: number) {
  return fetch("http://localhost:4000/estacionamientos/cerrar", {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + (this.auth.getToken() ?? ""),
      "content-type": "application/json"
    },
    body: JSON.stringify({
      patente: patente,
      idUsuarioIngreso: "admin"
    })
  });
}
}


