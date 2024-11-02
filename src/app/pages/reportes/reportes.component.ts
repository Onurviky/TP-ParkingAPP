// src/app/components/reportes/reportes.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../services/reportes.service';
import { ReporteEstacionamiento} from '../../interfaces/reportes';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent]
})

export class ReportesComponent implements OnInit {
  headerR = {
    nro: "N°",
    mes: "Mes",
    usos: "Usos",
    cobrado: "Cobrado"
  };

  // Array para almacenar los datos de los reportes
  reporteEstacionamientos: ReporteEstacionamiento[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.reportesService.fetchEstacionamientos()
      .then((data: Estacionamiento[]) => {
        this.reporteEstacionamientos = this.procesarEstacionamientos(data);
      })
      .catch((error) => {
        console.error("Error al cargar reportes:", error);
      });
  }

  private procesarEstacionamientos(data: Estacionamiento[]): ReporteEstacionamiento[] {
    const mesesTrabajo: { [key: string]: ReporteEstacionamiento } = {};

    data
      .filter(estacionada => estacionada.horaEgreso != null) 
      .forEach((estacionada, index) => {
        const fecha = new Date(estacionada.horaIngreso);
        const mes = `${fecha.toLocaleString('default', { month: 'long' })} ${fecha.getFullYear()}`;

        if (!mesesTrabajo[mes]) {
          mesesTrabajo[mes] = {
            nro: index + 1,
            mes: mes,
            usos: 1,
            cobrado: estacionada.costo ?? 0
          };
        } else {
          mesesTrabajo[mes].usos += 1;
          mesesTrabajo[mes].cobrado += estacionada.costo ?? 0;
        }
      });

    return Object.values(mesesTrabajo); // Devuelve el array de reportes
  }
}