import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { HeaderComponent } from './components/header/header.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PreciosComponent } from './pages/precios/precios.component';
import { ReportesComponent } from './pages/reportes/reportes.component';

function guardalogueado (){
    let auth = inject(AuthService); /**hace que si el usuario no esta logeado no pueda pasar a estado cocheras */
    let router = inject(Router);

    if (auth.estaLog()){
        return true
    }else {
        router.navigate(['/login'])  /**si no tiene un token, va a hacer que se logue y no pueda saltar la pagina de login */
        return false
}

}

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "estado-cocheras",
        component: EstadoCocherasComponent,
        canActivate: [guardalogueado]                       
    },
    {
        path: "",
        redirectTo: "login",
        pathMatch:"full"
    },
    {
        path: "header",
        component: HeaderComponent
    },
    {
        path: "precios",
        component: PreciosComponent
    },
    {
        path: "reportes",
        component: ReportesComponent
    }
];
