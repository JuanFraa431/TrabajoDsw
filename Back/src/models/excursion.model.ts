import { BaseModel } from '../shared/db/baseModel.model.js';
import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core';
import { Ciudad } from './ciudad.model.js';
import { PaqueteExcursion } from './paqueteExcursion.model.js';


@Entity()
export class Excursion extends BaseModel {

  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: false })
  descripcion!: string

  @Property({ nullable: false })
  detalle!: string

  @Property({ nullable: false })
  tipo!: string

  @Property({ nullable: false })
  nro_personas_max!: number

  @Property({ nullable: false })
  precio!: number

  @Property({ nullable: false })
  nombre_empresa!: string

  @Property({ nullable: false })
  mail_empresa!: string

  @ManyToOne(() => Ciudad, { nullable: false })
  ciudad!: Rel<Ciudad>

  @Property({ nullable: false })
  imagen!: string

  @OneToMany(() => PaqueteExcursion, (paqueteExcursion) => paqueteExcursion.excursion, {
    cascade: [Cascade.ALL],
    orphanRemoval: true
  })
  paqueteExcursiones = new Collection<PaqueteExcursion>(this);
}
