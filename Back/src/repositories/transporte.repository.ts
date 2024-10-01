import { Repository } from "../shared/repository.js";
import { Transporte } from "../models/transporte.model.js";
import { pool } from "../shared/conn.js";
import { RowDataPacket } from "mysql2";

export class TransporteRepository implements Repository<Transporte>{

    public async findAll(): Promise<Transporte [] | undefined> {
        const [transportes] = await pool.query('SELECT * FROM transportes')
        return transportes as Transporte []
    }

    public async findOne(item: {id:string}): Promise<Transporte | undefined>{
        const id = Number.parseInt(item.id)
        const [transportes] = await pool.query<RowDataPacket[]>('SELECT * FROM transportes where id = ?',
            [id])
        if(transportes.length == 0){
            return undefined
        }
        const transporte = transportes[0] as Transporte 
        return transporte
    }

    public async save(item: Transporte): Promise<Transporte> {
        const [result] = await pool.query('INSERT INTO transportes (descripcion, capacidad, tipo, nombre_empresa, mail_empresa) VALUES (?, ?, ?, ?, ?)',
            [item.descripcion, item.capacidad, item.tipo, item.nombre_empresa, item.mail_empresa]) as RowDataPacket[]
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return item
        } else {
            throw new Error('No se ha podido insertar el transporte')
        }
    }

    public async update(item: {id:string}, transporte: Transporte): Promise<Transporte | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
          'UPDATE transportes SET descripcion = ?, capacidad = ?, tipo = ?, nombre_empresa = ?, mail_empresa = ? WHERE id = ?',
          [
            transporte.descripcion,
            transporte.capacidad,
            transporte.tipo,
            transporte.nombre_empresa,
            transporte.mail_empresa,
            id,
          ]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return transporte
        } else {
            throw new Error('No se ha podido actualizar el transporte')
        }
    }

    public async remove(item: {id:string}): Promise<void> {
        const id = Number.parseInt(item.id)
        const [result] = await pool.query('DELETE FROM transportes WHERE id = ?',
            [id]) as RowDataPacket[]
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 0){
            throw new Error('No se ha podido borrar el transporte')
        }
    }
}

