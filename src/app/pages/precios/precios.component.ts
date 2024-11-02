import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss'
})
export class PreciosComponent {
  headerP = {
    tiempo: "Tiempo",
    costo: "Costo",
    acciones: "Acciones",

  };

  filasPrecios = [
    { tiempo: "30 min", costo: 200, acciones: false },
    { tiempo: "1 hra", costo: 500, acciones: false },
    {tiempo: "1 dia", costo: 900, acciones: false },
  ];

}
