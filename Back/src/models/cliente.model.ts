export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public dni: string,
    public email: string,
    public fechaNacimiento: Date,
    public estado: string,
    public username: string,
    public password: string,
    public tipo_usuario: string
  ) {}
}


