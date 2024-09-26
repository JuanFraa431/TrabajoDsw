import { Repository } from '../shared/repository.js';
import { Hotel } from '../models/hotel.model.js';
import { Ciudad } from '../models/ciudad.model.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class HotelRepository implements Repository<Hotel> {
  
  public async findAll(): Promise<Hotel[] | undefined> {
    const [hoteles_raw] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM hoteles'
    );
    let hoteles = hoteles_raw as Hotel[];
    for (let i = 0; i < hoteles.length; i++) {
      const [ciudades] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM ciudades WHERE id = ?',
        [hoteles_raw[i].id_ciudad]
      );
      console.log(ciudades);
      
      const ciudad = new Ciudad(
        ciudades[0].id,
        ciudades[0].nombre,
        ciudades[0].descripcion,
        ciudades[0].pais
      );
      

      hoteles[i] = new Hotel(
        hoteles[i].id,
        hoteles[i].nombre,
        hoteles[i].direccion,
        hoteles[i].descripcion,
        hoteles[i].telefono,
        hoteles[i].email,
        hoteles[i].estrellas,
        ciudad
      );
    }

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
    const [ciudades] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ciudades WHERE id = ?',
      [hoteles_raw[0].id_ciudad]
    );
    const ciudad = new Ciudad(
      ciudades[0].id,
      ciudades[0].nombre,
      ciudades[0].descripcion,
      ciudades[0].pais
    );
    const hotel = new Hotel(
      hoteles_raw[0].id,
      hoteles_raw[0].nombre,
      hoteles_raw[0].direccion,
      hoteles_raw[0].descripcion,
      hoteles_raw[0].telefono,
      hoteles_raw[0].email,
      hoteles_raw[0].estrellas,
      ciudad
    );

    return hotel;
  }

  public async save(item: Hotel): Promise<Hotel | undefined> {
    const [result] = await pool.query<[RowDataPacket[], ResultSetHeader]>(
      'INSERT INTO hoteles (nombre, direccion, descripcion, telefono, email, estrellas, id_ciudad) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.nombre, item.direccion, item.descripcion, item.telefono, item.email, item.estrellas, item.ciudad.id]
    );
    return item
  }

  public async update(item: { id: string }, hotel: Hotel): Promise<Hotel | undefined> {
    const id = Number.parseInt(item.id);
    await pool.query('UPDATE hoteles SET nombre = ?, direccion = ?, descripcion = ?, telefono = ?, email = ?, estrellas = ?, id_ciudad = ? WHERE id = ?', [hotel.nombre, hotel.direccion, hotel.descripcion, hotel.telefono, hotel.email, hotel.estrellas, hotel.ciudad.id, id]);
    return hotel;
  }
  
  public async remove(item: { id: string }): Promise<void> {
    const id = Number.parseInt(item.id);
    await pool.query('DELETE FROM hoteles WHERE id = ?', [id]);
  }
}
