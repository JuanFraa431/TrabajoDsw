import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Ciudad } from './ciudad.model.js';
import { BaseModel } from '../shared/db/baseModel.model.js';

@Entity()
export class Hotel extends BaseModel {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ nullable: false })
  direccion!: string;

  @Property({ nullable: false })
  telefono!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  estrellas!: number;

  @Property({ nullable: false })
  precio_x_dia!: number;

  @ManyToOne(() => Ciudad, { nullable: false })
  ciudad!: Rel<Ciudad>;
}
