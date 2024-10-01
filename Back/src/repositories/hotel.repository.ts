import { Repository } from '../shared/repository.js';
import { Hotel } from '../models/hotel.model.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class HotelRepository implements Repository<Hotel> {
  
  public async findAll(): Promise<Hotel[] | undefined> {
    const [hoteles] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM hoteles'
    );

    return hoteles as Hotel[];
  }

  public async findOne(item: { id: string }): Promise<Hotel | undefined> {
    const id = Number.parseInt(item.id);
    const [hoteles_raw] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM hoteles WHERE id = ?',
      [id]
    );
    if (hoteles_raw.length == 0) {
      return undefined;
    }
    
    const hotel = hoteles_raw[0] as Hotel;

    return hotel;
  }

  public async save(item: Hotel): Promise<Hotel | undefined> {
    const [result] = await pool.query<[RowDataPacket[], ResultSetHeader]>(
      'INSERT INTO hoteles (nombre, direccion, descripcion, telefono, email, estrellas, id_ciudad) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.nombre, item.direccion, item.descripcion, item.telefono, item.email, item.estrellas, item.id_ciudad]
    );
    const affectedRows = (result as any).affectedRows;
    if (affectedRows == 1) {
      return item;
    } else {
      throw new Error('No se ha podido insertar el hotel');
    }
  }

  public async update(item: { id: string }, hotel: Hotel): Promise<Hotel | undefined> {
    const id = Number.parseInt(item.id);
    await pool.query('UPDATE hoteles SET nombre = ?, direccion = ?, descripcion = ?, telefono = ?, email = ?, estrellas = ?, id_ciudad = ? WHERE id = ?', [hotel.nombre, hotel.direccion, hotel.descripcion, hotel.telefono, hotel.email, hotel.estrellas, hotel.id_ciudad, id]);
    return hotel;
  }
  
  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);
    await pool.query('DELETE FROM hoteles WHERE id = ?', [id]);
  }
}
