import { BaseModel } from '../shared/db/baseModel.model.js';
import {Entity, OneToMany, Property } from "@mikro-orm/core"
import { Estadia } from './estadia.model.js';

@Entity()
export class Cliente extends BaseModel {
    @Property({ nullable: false })
    nombre!: string;

    @Property({ nullable: false })
    apellido!: string;

    @Property({ nullable: false })
    dni!: string;

    @Property({ nullable: false })
    email!: string;

    @Property({ nullable: false })
    fechaNacimiento!: Date;

    @Property({ nullable: false })
    estado!: string;

    @Property({ nullable: false })
    username!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ nullable: false })
    tipo_usuario!: string;

    @Property({ nullable: false })
    imagen!: string;

    @OneToMany( () => Estadia, estadia => estadia.cliente)
    estadias = new Array<Estadia>();
}


