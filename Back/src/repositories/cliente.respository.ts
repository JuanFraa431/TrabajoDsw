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
}