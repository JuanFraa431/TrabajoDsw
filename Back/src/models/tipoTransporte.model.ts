import { Entity, Property, Collection, OneToMany } from '@mikro-orm/core';
import { BaseModel } from '../shared/db/baseModel.model.js';
import { Transporte } from './transporte.model.js';

@Entity()
export class TipoTransporte extends BaseModel {

  @Property({ nullable: false })
  nombre!: string; // 'Avión', 'Colectivo', etc.

  @OneToMany(() => Transporte, (transporte) => transporte.tipoTransporte)
  transportes = new Collection<Transporte>(this);
}
