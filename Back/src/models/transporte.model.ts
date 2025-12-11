import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseModel } from '../shared/db/baseModel.model.js';
import { Ciudad } from './ciudad.model.js';
import { TipoTransporte } from './tipoTransporte.model.js';

@Entity()
export class Transporte extends BaseModel {

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;
  
  @Property({ nullable: false })
  capacidad!: number;
  
  @ManyToOne(() => TipoTransporte, { nullable: false })
  tipoTransporte!: Rel<TipoTransporte>;
  
  @Property({ nullable: false })
  nombre_empresa!: string;
  
  @Property({ nullable: false })
  mail_empresa!: string;

  @ManyToOne(() => Ciudad, { nullable: true })
  ciudadOrigen!: Rel<Ciudad>;

  @ManyToOne(() => Ciudad, { nullable: true })
  ciudadDestino!: Rel<Ciudad>;

  @Property({ nullable: true })
  fecha_salida!: Date;

  @Property({ nullable: true })
  fecha_llegada!: Date;

  @Property({ nullable: true })
  precio!: number;

  @Property({ nullable: true })
  asientos_disponibles!: number;

  @Property({ nullable: true, default: true })
  activo!: boolean;
}
