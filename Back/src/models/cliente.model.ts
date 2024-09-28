export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public dni: string,
    public email: string,
    public fechaNacimiento: Date,
    public estado: string
  ) {}
}


