import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import { CocherasService } from '../../services/cocheras.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})

export class EstadoCocherasComponent {
  titulo: string = 'Estado de la cochera';

  filas: (Cochera & { activo: Estacionamiento | null, horaDeshabilitacion: string | null })[] = []; 
  siguienteNumero: number = 1;

  auth = inject(AuthService);
  cocheras = inject(CocherasService);
  estacionamientos = inject(EstacionamientosService);

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    return this.cocheras.getCocheras().then(cocheras => {
      this.filas = [];

      for (let cochera of cocheras) {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        })
      };
    });
  }

  datosEstadoCocheras = {
    descripcion: " "
  }


  agregarFila(): void {
    this.cocheras.agregarCochera(this.datosEstadoCocheras)
      .then(data => {
        console.log(data);
        this.ngOnInit(); // Recarga los datos después de agregar
      })
      .catch(error => {
        console.error('Hubo un problema con la operación fetch:', error);
      });
  }

  /** Elimina las cocheras activas */
  eliminarFila(idCochera: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    Swal.fire({
      title: 'Queres borrar la cochera?',
      text: 'Esta acción es irrevertible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.eliminarCochera(idCochera)
          .then(response => {
            if (response.ok) {
              swalWithBootstrapButtons.fire({
                title: 'Genial!',
                text: 'La cochera se borró con éxito!',
                icon: 'success'
              });
              // Eliminar la fila en el frontend
              this.filas = this.filas.filter(item => item.id !== idCochera);
            } else {
              swalWithBootstrapButtons.fire({
                title: 'Error',
                text: 'No se borro la cochera.',
                icon: 'error'
              });
            }
          })
          .catch(error => {
            console.error('Error al borrar la cochera:', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ocurrió un error al intentar borrar la cochera.',
              icon: 'error'
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'La cochera no ha sido eliminada.',
          icon: 'info'
        });
      }
    });
  }

  abrirModalEstacionamiento(idCochera: number) {
    Swal.fire({
      title: "Ingrese la patente del vehículo",
      input: "text",
      inputPlaceholder: "Ejemplo: ABC123",
      showCancelButton: true,
      confirmButtonText: "Registrar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese una patente válida";
        }
        return null;
      }
    }).then(res => {
      if (res.isConfirmed) {
        const patente = res.value;
        const horaIngreso = new Date().toLocaleString();
  
        
        this.filas = this.filas.map(fila => {
          if (fila.id === idCochera) {
            return {
              ...fila,
              activo: {
                id: 0, 
                idCochera: fila.id,
                idUsuareoIngreso: "admin", 
                idUsuareoEgreso: null,
                horaIngreso: horaIngreso,
                horaEgreso: null,
                costo: 0, 
                patente: patente,
                eliminado: null
              } as Estacionamiento, 
              deshabilitada: true
            };
          }
          return fila;
        });
  
        // Llamar al servicio para abrir el estacionamiento
        this.estacionamientos.abrirEstacionamiento(patente, idCochera).then(() => {
          this.traerCocheras(); // Recargar datos si es necesario
        });
  
        Swal.fire(
          "Patente Registrada",
          `El vehículo con patente ${patente} ha sido registrado con éxito.`,
          "success"
        );
      }
    });
  }

  ModalNoDisponible() {
    Swal.fire("El estacionamiento no puede ser ocupado porque no esta disponible");
  }

  cerrarModalEstacionamiento(idCochera: number, patente: string) {
    Swal.fire({
      title: '¿Deseas cerrar el estacionamiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.estacionamientos.cerrarEstacionamiento(patente, idCochera)
          .then((r) => {
            if (!r.ok) throw new Error("Error en la respuesta del servidor");
            return r.json(); 
          })
          .then((rJson) => {
            const costo = rJson.costo;
            this.traerCocheras();
            Swal.fire({
              title: 'La cochera ha sido cerrada',
              text: `El precio a cobrar es ${costo}`,
              icon: 'info'
            });
          });
      } else if (res.dismiss) {
        Swal.fire({
          title: 'Cancelado',
          text: 'La cochera no ha sido cerrada.',
          icon: 'info'
        });
      }
    });
  }

  abrirModalDesbloquear() {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  cambiarDisponibilidadCochera(idCochera: number) {
    const cochera = this.filas[idCochera]; // accede a la cochera actual
    const estadoActual = cochera.deshabilitada ? 'no disponible' : 'disponible';
    const proximoEstado = cochera.deshabilitada ? 'disponible' : 'no disponible';
    if (cochera.deshabilitada) {
      this.cocheras.habilitarCochera(cochera).then(() => this.traerCocheras());
    } else {
      this.cocheras.deshabilitarCochera(cochera).then(() => this.traerCocheras());
    };
  }
  trackById(index: number, item: any): number {
    return item.id;}

}
