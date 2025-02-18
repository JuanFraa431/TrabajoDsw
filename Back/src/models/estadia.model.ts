import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseModel } from '../shared/db/baseModel.model.js';
import { Paquete } from './paquete.model.js';
import { Hotel } from './hotel.model.js';
import { Cliente } from './usuario.model.js';

@Entity()
export class Estadia extends BaseModel {
  @ManyToOne(() => Paquete, { nullable: false })
  paquete!: Paquete;

  @ManyToOne(() => Hotel, { nullable: false })
  hotel!: Hotel;

  @Property({ nullable: false })
  fecha_ini!: Date;

  @Property({ nullable: false })
  fecha_fin!: Date;

  @Property({ nullable: false })
  precio_x_dia!: number;

  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Rel<Cliente>;
}
