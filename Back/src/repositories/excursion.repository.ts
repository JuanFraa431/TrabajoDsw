import { Repository } from '../shared/repository.js';
import { Excursion } from '../models/excursion.model.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ExcursionRepository implements Repository<Excursion> {
  public async findAll(): Promise<Excursion[] | undefined> {
    const [excursiones] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM excursiones'
    )
    return excursiones as Excursion[];
    }

  public async findOne(item: { id: string }): Promise<Excursion | undefined> {
    const id = Number.parseInt(item.id);
    const [excursiones_raw] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM excursiones WHERE id = ?',
      [id]
    );
    if (excursiones_raw.length == 0) {
      return undefined;
    }

    const excursion = excursiones_raw[0] as Excursion;
    
    return excursion;
  }

  public async save(item: Excursion): Promise<Excursion | undefined> {
    const [result] = await pool.query<[RowDataPacket[], ResultSetHeader]>(
      'INSERT INTO excursiones (nombre, tipo, descripcion, detalle, horario, nro_personas_max, nombre_empresa, mail_empresa, precio, id_ciudad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        item.nombre,
        item.tipo,
        item.descripcion,
        item.horario,
        item.nro_personas_max,
        item.nombre_empresa,
        item.mail_empresa,
        item.precio,
        item.id_ciudad
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
      'UPDATE excursiones SET nombre = ?, tipo = ?, descripcion = ?, detalle = ?, horario = ?, nro_personas_max = ?, nombre_empresa = ?, mail_empresa = ?, precio = ?, id_ciudad = ? WHERE id = ?',
      [
        excursion.nombre,
        excursion.tipo,
        excursion.descripcion,
        excursion.detalle,
        excursion.horario,
        excursion.nro_personas_max,
        excursion.nombre_empresa,
        excursion.mail_empresa,
        excursion.precio,
        excursion.id_ciudad,
        id,
      ]
    );
    return excursion;
  }

  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);
    await pool.query('DELETE FROM excursiones WHERE id = ?', [id]);
  }

  public async findByType(params: { tipo: string }): Promise<Excursion[]> {
    const { tipo } = params;
    const [excursiones] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM excursiones WHERE tipo = ?',
      [tipo]
    );
    return excursiones as Excursion[];
  }
  public async findTypes(): Promise<{ tipo: string; cantidad: number }[]> {
      const [tipos] = await pool.query<RowDataPacket[]>(
        'SELECT tipo, COUNT(*) as cantidad FROM excursiones GROUP BY tipo'
      );
      return tipos.map((row) => ({
        tipo: row.tipo,
        cantidad: row.cantidad
      }));
  }
}
