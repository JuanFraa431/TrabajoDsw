import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, ManyToMany, Property } from '@mikro-orm/core';
import { ReservaPaquete } from './reservaPaquete.model.js';
import { Collection } from '@mikro-orm/core';

@Entity()
export class Persona extends BaseModel {
    @Property({ nullable: true })
    nombre!: string;

    @Property({ nullable: true })
    apellido!: string; // Ensure apellido is defined

    @Property({ nullable: true })
    dni!: string;

    @Property({ nullable: true })
    email!: string;

    @Property({ nullable: true, columnType: 'date' })
    fecha_nacimiento!: Date;

    @ManyToMany(() => ReservaPaquete, rp => rp.personas, { owner: true })
    reservas = new Collection<ReservaPaquete>(this);
}