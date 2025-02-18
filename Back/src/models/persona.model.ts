import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, OneToMany, Property } from '@mikro-orm/core';

@Entity()
export class Persona extends BaseModel {
    @Property({ nullable: false })
    nombre!: string;

    @Property({ nullable: false })
    apellido!: string;

    @Property({ nullable: false })
    dni!: string;

    @Property({ nullable: false })
    email!: string;

    @Property({ nullable: false })
    fecha_nacimiento!: Date;

}