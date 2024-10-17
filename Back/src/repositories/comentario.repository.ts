import { Repository } from '../shared/repository.js';
import { Comentario } from '../models/comentario.model.js';
import { pool } from '../shared/conn.js';
import { RowDataPacket } from 'mysql2';

export class ComentarioRepository implements Repository<Comentario> {
  public async findAll(): Promise<Comentario[] | undefined> {
    const [comentarios] = await pool.query('SELECT * FROM comentarios');
    return comentarios as Comentario[];
  }

  public async findOne(item: { id: string }): Promise<Comentario | undefined> {
    const id = Number.parseInt(item.id);
    const [comentarios] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM comentarios where id = ?',
      [id]
    );
    if (comentarios.length == 0) {
      return undefined;
    }
    const comentario = comentarios[0] as Comentario;
    return comentario;
  }

  public async save(item: Comentario): Promise<Comentario> {
    const [result] = (await pool.query(
      'INSERT INTO comentarios (id_cliente, id_paquete, fecha, descripcion, estrellas) VALUES (?, ?, ?, ?, ?)',
      [
        item.id_cliente, 
        item.id_paquete, 
        item.fecha, 
        item.descripcion, 
        item.estrellas
      ]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return item;
    } else {
      throw new Error('No se ha podido insertar el comentario');
    }
  }

  public async update(
    item: { id: string },
    comentario: Comentario
  ): Promise<Comentario | undefined> {
    const id = Number.parseInt(item.id);
    const [result] = (await pool.query(
      'UPDATE comentarios SET id_cliente = ?, id_paquete = ?, fecha = ?, descripcion = ?, estrellas = ? WHERE id = ?',
      [
        comentario.id_cliente, 
        comentario.id_paquete, 
        comentario.fecha, 
        comentario.descripcion, 
        comentario.estrellas, 
        id
      ]
    )) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return comentario;
    } else {
      throw new Error('No se ha podido actualizar el comentario');
    }
  }

  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);
    const [result] = (await pool.query('DELETE FROM comentarios WHERE id = ?', [
      id,
    ])) as RowDataPacket[];
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 0) {
      throw new Error('No se ha podido borrar el comentario');
    }
  }

  public async findByPaquete(id: string): Promise<Comentario[] | undefined> {
    const [comentarios] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM comentarios where id_paquete = ?',
      [id]
    );
    return comentarios as Comentario[];
  }
}
