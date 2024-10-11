import { Repository } from "../shared/repository.js";
import { Cliente } from "../models/cliente.model.js";
import { pool } from "../shared/conn.js";
import { RowDataPacket } from "mysql2";

export class ClienteRepository implements Repository<Cliente>{

    public async findAll(): Promise<Cliente [] | undefined> {
        const [clientes] = await pool.query('SELECT * FROM clientes')
        return clientes as Cliente []
    }

    public async findOne(item: {id:string}): Promise<Cliente | undefined>{
        const id = Number.parseInt(item.id)
        const [clientes] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes where id = ?',
            [id])
        if(clientes.length == 0){
            return undefined
        }
        const cliente = clientes[0] as Cliente 
        return cliente
    }

    public async save(item: Cliente): Promise<Cliente> {
        const [result] = await pool.query('INSERT INTO clientes (nombre, apellido, DNI, email, fecha_nacimiento, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [item.nombre, item.apellido, item.dni, item.email, item.fechaNacimiento,item.estado]) as RowDataPacket[]
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return item
        } else {
            throw new Error('No se ha podido insertar el cliente')
        }
    }

    public async update(item: {id:string}, cliente: Cliente): Promise<Cliente | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
          'UPDATE clientes SET nombre = ?, apellido = ?, dni = ?, email = ?, fecha_nacimiento = ?, estado = ? WHERE id = ?',
          [
            cliente.nombre,
            cliente.apellido,
            cliente.dni,
            cliente.email,
            cliente.fechaNacimiento,
            cliente.estado,
            id,
          ]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 1){
            return cliente
        } else {
            throw new Error('No se ha podido actualizar el cliente')
        }
    }

    public async remove(item: {id:string}): Promise<void> {
        const id = Number.parseInt(item.id)
        const [result] = await pool.query('UPDATE clientes SET estado = 0 WHERE id = ?',
            [id]) as RowDataPacket[]
        const affectedRows = (result as any).affectedRows
        if(affectedRows == 0){
            throw new Error('No se ha podido borrar el cliente')
        }
    }
}