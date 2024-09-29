import { Repository } from '../shared/repository.js';
import { Excursion } from '../models/excursion.model.js';
import { Ciudad } from '../models/ciudad.model.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ExcursionRepository implements Repository<Excursion> {
  public async findAll(): Promise<Excursion[] | undefined> {
    const [excursiones_raw] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM excursion'
    );
    let excursiones = excursiones_raw as Excursion[];
    for (let i = 0; i < excursiones.length; i++) {
      const [ciudades] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM ciudad WHERE id = ?',
        [excursiones_raw[i].id_ciudad]
      );

      const ciudad = new Ciudad(
        ciudades[0].id,
        ciudades[0].nombre,
        ciudades[0].descripcion,
        ciudades[0].pais
      );

      excursiones[i] = new Excursion(
        excursiones[i].id,
        excursiones[i].nombre,
        excursiones[i].descripcion,
        excursiones[i].tipo,
        excursiones[i].horario,
        excursiones[i].nro_personas_max,
        excursiones[i].nombre_empresa,
        excursiones[i].mail_empresa,
        excursiones[i].precio,
        ciudad
      );
    }

    return excursiones as Excursion[];
  }

  public async findOne(item: { id: string }): Promise<Excursion | undefined> {
    const id = Number.parseInt(item.id);
    const [excursiones_raw] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM excursion WHERE id = ?',
      [id]
    );
    if (excursiones_raw.length == 0) {
      return undefined;
    }
    const [ciudades] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ciudad WHERE id = ?',
      [excursiones_raw[0].id_ciudad]
    );
    const ciudad = new Ciudad(
      ciudades[0].id,
      ciudades[0].nombre,
      ciudades[0].descripcion,
      ciudades[0].pais
    );
    const excursion = new Excursion(
      excursiones_raw[0].id,
      excursiones_raw[0].nombre,
      excursiones_raw[0].descripcion,
      excursiones_raw[0].tipo,
      excursiones_raw[0].horario,
      excursiones_raw[0].nro_personas_max,
      excursiones_raw[0].nombre_empresa,
      excursiones_raw[0].mail_empresa,
      excursiones_raw[0].precio,
      ciudad
    );

    return excursion;
  }

  public async save(item: Excursion): Promise<Excursion | undefined> {
    const [result] = await pool.query<[RowDataPacket[], ResultSetHeader]>(
      'INSERT INTO excursion (nombre, tipo, descripcion, horario, nro_personas_max, nombre_empresa, mail_empresa, precio, id_ciudad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        item.nombre,
        item.tipo,
        item.descripcion,
        item.horario,
        item.nro_personas_max,
        item.nombre_empresa,
        item.mail_empresa,
        item.precio,
        item.ciudad.id,
      ]
    );
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return item;
    } else {
      throw new Error('No se ha podido insertar la excursion');
    }
  }

  public async update(
    item: { id: string },
    excursion: Excursion
  ): Promise<Excursion | undefined> {
    const id = Number.parseInt(item.id);
    await pool.query(
      'UPDATE excursion SET nombre = ?, tipo = ?, descripcion = ?, horario = ?, nro_personas_max = ?, nombre_empresa = ?, mail_empresa = ?, precio = ?, id_ciudad = ? WHERE id = ?',
      [
        excursion.nombre,
        excursion.tipo,
        excursion.descripcion,
        excursion.horario,
        excursion.nro_personas_max,
        excursion.nombre_empresa,
        excursion.mail_empresa,
        excursion.precio,
        excursion.ciudad.id,
        id,
      ]
    );
    return excursion;
  }

  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);
    await pool.query('DELETE FROM excursion WHERE id = ?', [id]);
  }
}
