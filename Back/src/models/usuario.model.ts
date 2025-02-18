import { Persona } from './persona.model.js';
import {Entity, OneToMany, Property } from "@mikro-orm/core"
import { Estadia } from './estadia.model.js';

@Entity()
export class Usuario extends Persona {
    @Property({ nullable: false })
    email!: string;

    @Property({ nullable: false })
    estado!: number;

    @Property({ nullable: false })
    username!: string;

    @Property({ nullable: false, hidden: true })
    password!: string;

    @Property({ nullable: false })
    tipo_usuario!: string;

    @Property({ nullable: true })
    imagen!: string;

    @OneToMany( () => Estadia, estadia => estadia.cliente)
    estadias = new Array<Estadia>();
}


