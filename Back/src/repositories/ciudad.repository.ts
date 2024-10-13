import { Repository } from '../shared/repository.js';
import { Ciudad } from '../models/ciudad.model.js';
import { pool } from '../shared/conn.js';
import { RowDataPacket } from 'mysql2';

export class CiudadRepository implements Repository<Ciudad> {
  public async findAll(): Promise<Ciudad[] | undefined> {
    const [ciudades] = await pool.query('SELECT * FROM ciudades');
    return ciudades as Ciudad[];
  }

  public async findOne(item: { id: string }): Promise<Ciudad | undefined> {
    const id = Number.parseInt(item.id);
    const [ciudades] = (await pool.query<RowDataPacket[]>(
      'SELECT * FROM ciudades where id = ?',
      [id]
    )) as RowDataPacket[];
    if (ciudades.length == 0) {
      return undefined;
    }
    const ciudad = ciudades[0] as Ciudad;
    return ciudad;
  }

  public async save(item: Ciudad): Promise<Ciudad> {
    const [result] = (await pool.query(
      'INSERT INTO ciudades (nombre, descripcion, pais, latitud, longitud) VALUES (?, ?, ?, ?, ?)',
      [item.nombre, item.descripcion, item.pais, item.latitud, item.longitud]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return item;
    } else {
      throw new Error('No se ha podido insertar la ciudad');
    }
  }

  public async update(item: { id: string }, ciudad: Ciudad): Promise<Ciudad | undefined> {
    const id = Number.parseInt(item.id);
    const [result] = (await pool.query(
      'UPDATE ciudades SET nombre = ?, descripcion = ?, pais = ?, latitud = ?, longitud = ? WHERE id = ?',
      [ciudad.nombre, ciudad.descripcion, ciudad.pais, ciudad.latitud, ciudad.longitud, id]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return ciudad;
    } else {
      throw new Error('No se ha podido actualizar la ciudad');
    }
  }

  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);

    const [result_hotel] = (await pool.query('SELECT * FROM hoteles WHERE id_ciudad = ?', [id])) as RowDataPacket[];
    if ((result_hotel as any).length > 0) {
      throw new Error('No se puede borrar la ciudad porque tiene hoteles asociados');
    }
    
    const [result_excursion] = (await pool.query('SELECT * FROM excursiones WHERE id_ciudad = ?', [id])) as RowDataPacket[];
    if ((result_excursion as any).length > 0) {
      throw new Error('No se puede borrar la ciudad porque tiene excursiones asociadas');
    }

    const [result] = (await pool.query('DELETE FROM ciudades WHERE id = ?', [id])) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 0) {
      throw new Error('No se ha podido borrar la ciudad');
    }
  }
}
