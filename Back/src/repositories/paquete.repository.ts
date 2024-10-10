import { Repository } from "../shared/repository.js";
import { Paquete } from "../models/paquete.model.js";
import { pool } from "../shared/conn.js";
import { RowDataPacket } from "mysql2";

export class PaqueteRepository implements Repository<Paquete>{

    public async findAll(): Promise<Paquete [] | undefined> {
        const [paquetes] = await pool.query('SELECT * FROM paquetes')
        return paquetes as Paquete []
    }

    public async findOne(item: {id:string}): Promise<Paquete | undefined>{
        const id = Number.parseInt(item.id)
        const [paquetes] = await pool.query<RowDataPacket[]>('SELECT * FROM paquetes where id = ?',
            [id])
        if(paquetes.length == 0){
            return undefined
        }
        const paquete = paquetes[0] as Paquete
        return paquete
    }

    public async save(item: Paquete): Promise<Paquete> {
        const [result] = (await pool.query(
          'INSERT INTO paquetes (estado, descripcion, precio, fecha_ini, fecha_fin) VALUES (?, ?, ?, ?, ?)',
          [item.estado, item.descripcion, item.precio, item.fecha_ini, item.fecha_fin]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return item
        } else {
            throw new Error('No se ha podido insertar el paquete')
        }
    }

    public async update(item: {id:string}, paquete: Paquete): Promise<Paquete | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
          'UPDATE paquetes SET estado = ?, descripcion = ?, precio = ?, fecha_ini = ?, fecha_fin = ? WHERE id = ?',
          [paquete.estado, paquete.descripcion, paquete.precio, paquete.fecha_ini, paquete.fecha_fin, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return paquete
        } else {
            throw new Error('No se ha podido actualizar el paquete')
        }
    }

    public async remove(item: {id:string}): Promise<void> {
        const id = Number.parseInt(item.id)
        const [result] = await pool.query('DELETE FROM paquetes WHERE id = ?',
            [id]) as RowDataPacket[]
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 0){
            throw new Error('No se ha podido borrar el paquete')
        }
    }

    public async search(params: { ciudad: string; fechaInicio: string; fechaFin: string; precioMaximo: number }): Promise<Paquete[]> {
        const { ciudad, fechaInicio, fechaFin, precioMaximo } = params;
    
        const [paquetes] = await pool.query<RowDataPacket[]>(`
            SELECT p.*, c.nombre
            FROM paquetes p
            JOIN estadias e ON p.id = e.id_paquete
            JOIN hoteles h ON e.id_hotel = h.id
            JOIN ciudades c ON h.id_ciudad = c.id
            WHERE c.nombre = ? 
            AND p.fecha_ini >= ? 
            AND p.fecha_fin <= ? 
            AND p.precio <= ?
        `, [ciudad, fechaInicio, fechaFin, precioMaximo]);
    
        return paquetes as Paquete[];
    }
}

