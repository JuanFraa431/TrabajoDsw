import { Ciudad } from "./ciudad.model.js";

export class Hotel {
  constructor(
    public id: number,
    public nombre: string,
    public direccion: string,
    public descripcion: string,
    public telefono: string,
    public email: string,
    public estrellas: number,
    public id_ciudad: number,
  ) {}
}