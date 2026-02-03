import { BaseModel } from '../shared/db/baseModel.model.js';
import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { ReservaPaquete } from './reservaPaquete.model.js';

@Entity()
export class Cancelacion extends BaseModel {
    @ManyToOne(() => ReservaPaquete, { nullable: false })
    reserva!: Rel<ReservaPaquete>;

    @Property({ nullable: false })
    motivo!: string;

    @Property({ nullable: false })
    fecha_cancelacion!: Date;
}
