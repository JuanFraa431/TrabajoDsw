export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_nacimiento: string;
  estado: number;
  username: string;
  password: string;
  tipo_usuario: "ADMIN" | "CLIENTE";
  imagen: string;
}
