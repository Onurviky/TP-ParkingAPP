import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { LoginComponent } from '../pages/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  getToken(): string | null {
      return localStorage.getItem('token') ?? ''
  }
  estaLog(): boolean{
    if(this.getToken())
      return true;
    else 
    return false
  }

  
  
  Login(datosLogin:Login){
      console.log("Inicio Login");
      return fetch("http://localhost:4000/login",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"  /**es para que entienda los archivos.json */
        },       
        body: JSON.stringify(datosLogin)
      }).then(res => res.json().then(data => {
          if (data.status === 'ok') {
            localStorage.setItem('token', data.token);
            return true;
          } else {
            return false
    }}))}

  logout(): void { 
    localStorage.removeItem("token");
    }
        
        };
        
      

