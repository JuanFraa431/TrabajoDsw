import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { Paquete } from './paquete.model.js';
import { Usuario } from './usuario.model.js';
import { Persona } from './persona.model.js';
import { Collection } from '@mikro-orm/core';

@Entity()
export class ReservaPaquete extends BaseModel {
    @Property({ nullable: true })
    fecha!: Date;

    @ManyToOne(() => Paquete, { nullable: true })
    paquete!: Paquete;

    @ManyToOne(() => Usuario, { nullable: true })
    usuario!: Usuario;

    @Property({ nullable: true })
    fecha_cancelacion!: Date;

    @Property({ nullable: true })
    motivo_cancelacion!: string;

    @ManyToMany(() => Persona, p => p.reservas)
    personas = new Collection<Persona>(this);
}