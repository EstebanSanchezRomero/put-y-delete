import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' }; 
  idUsuarioEditar: number | null = null; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id,
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post<ApiResponse>('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        // Agregar usuario con el ID proporcionado por la API
        const usuarioAgregado: Usuario = { ...this.nuevoUsuario, id: response.id };
        this.usuarios.push(usuarioAgregado);
        this.limpiarFormulario();
      });
  }

  buscarUsuarioPorId() {
    const usuario = this.usuarios.find(u => u.id === this.idUsuarioEditar);
    if (usuario) {
      this.nuevoUsuario = { ...usuario }; // Rellenar el formulario con los datos del usuario
    } else {
      alert('Usuario no encontrado');
      this.limpiarFormulario();
    }
  }

  actualizarUsuario() {
    if (!this.nuevoUsuario.id) return;

    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.put(`https://jsonplaceholder.typicode.com/users/${this.nuevoUsuario.id}`, body)
      .subscribe(() => {
        const index = this.usuarios.findIndex(u => u.id === this.nuevoUsuario.id);
        if (index !== -1) {
          this.usuarios[index] = { ...this.nuevoUsuario }; // Actualiza el usuario
        }
        this.limpiarFormulario();
      });
  }

  eliminarUsuario(usuario: Usuario) {
    this.http.delete(`https://jsonplaceholder.typicode.com/users/${usuario.id}`)
      .subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u !== usuario);
      });
  }

  limpiarFormulario() {
    this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; // Resetea el formulario
    this.idUsuarioEditar = null; // Resetea el ID de edición
  }
}
