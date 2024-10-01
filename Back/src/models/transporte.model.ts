export class Transporte {
  constructor(
    public id: number,
    public descripcion: string,
    public capacidad: number,
    public tipo: string,
    public nombre_empresa: string,
    public mail_empresa: string
  ) {}
}