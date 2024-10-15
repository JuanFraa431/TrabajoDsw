export class Excursion {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public tipo: string,
    public horario: string,
    public nro_personas_max: number,
    public nombre_empresa: string,
    public mail_empresa: string,
    public precio: number,
    public id_ciudad: number,
  ) {}
}
