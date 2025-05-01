import { BaseModel } from '../shared/db/baseModel.model.js';
import {
    Entity,
    ManyToMany,
    ManyToOne,
    Property,
    Collection,
    Rel,
    OneToOne,
} from '@mikro-orm/core';
import { Usuario } from './usuario.model.js';
import { Paquete } from './paquete.model.js';
import { Persona } from './persona.model.js';
import { Pago } from './pago.model.js';

@Entity()
export class ReservaPaquete extends BaseModel {
    @Property({ nullable: true })
    fecha!: Date;

    @ManyToOne(() => Paquete, { nullable: true })
    paquete!: Rel<Paquete>;

    @ManyToOne(() => Usuario, { nullable: true })
    usuario!: Rel<Usuario>;

    @Property({ nullable: true })
    fecha_cancelacion!: Date;

    @Property({ nullable: true })
    motivo_cancelacion!: string;

    @Property({ nullable: true })
    estado!: string;

    @ManyToMany(() => Persona, (p) => p.reservas)
    personas = new Collection<Persona>(this);

    @OneToOne(() => Pago, { nullable: true })
    pago!: Rel<Pago>;
}
