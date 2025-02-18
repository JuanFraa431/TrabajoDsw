import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, Property } from '@mikro-orm/core';

@Entity()
export class Persona extends BaseModel {

    @Property({ nullable: true })
    dni!: string;

    @Property({ nullable: true })
    nombre!: string;

    @Property({ nullable: true })
    apellido!: string;

    @Property({ nullable: true })
    fecha_nacimiento!: Date;
}