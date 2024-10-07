export class Estadia {
  constructor(
    public id_paquete: number,
    public id_hotel: number,
    public fecha_ini: Date,
    public fecha_fin: Date,
    public precio_x_dia: number
  ) {}
}
