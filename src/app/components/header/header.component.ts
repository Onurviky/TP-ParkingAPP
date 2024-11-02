import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  esAdmin:boolean = false;
  auth = inject(AuthService)
  router = inject(Router)
  
  resultadoInput: string = " ";
  
  logout() {// llama al auth service para hacer logout
    this.auth.logout();
    this.router.navigate(['/login']);  // redirige a la página de login
  }
};



