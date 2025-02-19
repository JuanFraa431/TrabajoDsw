import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { ReservaPaquete } from './reservaPaquete.model.js';
import { Collection } from '@mikro-orm/core';

@Entity()
export class Persona extends BaseModel {
    @Property({ nullable: true })
    nombre!: string;

    @Property({ nullable: true })
    apellido!: string;

    @Property({ nullable: true })
    dni!: string;

    @Property({ nullable: true })
    email!: string;

    @Property({ nullable: true })
    fecha_nacimiento!: Date;

    @ManyToMany(() => ReservaPaquete, rp => rp.personas)
    reservas = new Collection<ReservaPaquete>(this);
}