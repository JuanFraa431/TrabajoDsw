import {Entity, OneToMany, Property } from "@mikro-orm/core"
import { Estadia } from './estadia.model.js';
import { Persona } from "./persona.model.js";

@Entity()
export class Usuario extends Persona {
    @Property({ nullable: true })
    dni!: string;

    @Property({ nullable: true })
    nombre!: string;

    @Property({ nullable: true })
    apellido!: string;

    @Property({ nullable: true })
    fecha_nacimiento!: Date;
    
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

    @OneToMany(() => Estadia, (estadia) => estadia.usuario)
    estadias = new Array<Estadia>();
}


