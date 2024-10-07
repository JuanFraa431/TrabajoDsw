import { Repository } from '../shared/repository.js';
import { Estadia } from '../models/estadia.model.js';
import { pool } from '../shared/conn.js';
import { RowDataPacket } from 'mysql2';

export class EstadiaRepository implements Repository<Estadia> {
  public async findAll(): Promise<Estadia[] | undefined> {
    const [estadias] = await pool.query('SELECT * FROM estadias');
    return estadias as Estadia[];
  }

  public async findOne(item: {
    id_paquete: string;
    id_hotel: string;
    fecha_ini: string;
  }): Promise<Estadia | undefined> {
    const idPaquete = Number.parseInt(item.id_paquete);
    const idHotel = Number.parseInt(item.id_hotel);
    const fechaIni = item.fecha_ini;

    const [estadias] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM estadias WHERE id_paquete = ? AND id_hotel = ? AND fecha_ini = ?',
      [idPaquete, idHotel, fechaIni]
    );

    if (estadias.length == 0) {
      return undefined;
    }

    const estadia = estadias[0] as Estadia;
    return estadia;
  }

  public async save(item: Estadia): Promise<Estadia> {
    const [result] = (await pool.query(
      'INSERT INTO estadias (id_paquete, id_hotel, fecha_ini, fecha_fin, precio_x_dia) VALUES (?, ?, ?, ?, ?)',
      [
        item.id_paquete,
        item.id_hotel,
        item.fecha_ini,
        item.fecha_fin,
        item.precio_x_dia,
      ]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return item;
    } else {
      throw new Error('No se ha podido insertar la estadia');
    }
  }

  public async update(
    item: { id_paquete: string; id_hotel: string, fecha_ini: string },
    estadia: Estadia
  ): Promise<Estadia | undefined> {

    const idPaquete = Number.parseInt(item.id_paquete);
    const idHotel = Number.parseInt(item.id_hotel);
    const fechaIni = item.fecha_ini;

    const [result] = (await pool.query(
      'UPDATE estadias SET id_paquete = ?, id_hotel = ?, fecha_ini = ?, fecha_fin = ?, precio_x_dia = ? WHERE id_paquete = ? AND id_hotel = ? AND fecha_ini = ?',
      [
        estadia.id_paquete,
        estadia.id_hotel,
        estadia.fecha_ini,
        estadia.fecha_fin,
        estadia.precio_x_dia,
        idPaquete,
        idHotel,
        fechaIni,
      ]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return estadia;
    } else {
      throw new Error('No se ha podido actualizar la estadia');
    }
  }

  public async remove(item: { id_paquete: string, id_hotel:string, fecha_ini: string }): Promise<void> {
    
    const idPaquete = Number.parseInt(item.id_paquete);
    const idHotel = Number.parseInt(item.id_hotel);
    const fechaIni = item.fecha_ini;

    const [result] = (await pool.query(
      'DELETE FROM estadias WHERE id_paquete = ? AND id_hotel = ? AND fecha_ini = ?',
      [idPaquete, idHotel, fechaIni]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 0) {
      throw new Error('No se ha podido borrar la estadia');
    }
  }
}
