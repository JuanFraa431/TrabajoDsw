import { BaseModel } from '../shared/db/baseModel.model.js';
import { OneToMany, Property, Collection, Entity, Cascade } from '@mikro-orm/core';
import { Comentario } from './comentario.model.js';
import { Estadia } from './estadia.model.js';

@Entity()
export class Paquete extends BaseModel {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  estado!: number;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ nullable: false })
  detalle!: string;

  @Property({ nullable: false })
  precio!: number;

  @Property({ nullable: false })
  fecha_ini!: Date;

  @Property({ nullable: false })
  fecha_fin!: Date;

  @Property({ nullable: false })
  imagen!: string;

  @OneToMany(() => Comentario, (comentario) => comentario.paquete, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  comentarios = new Collection<Comentario>(this);

  @OneToMany(() => Estadia, (estadia) => estadia.paquete, {
    cascade: [Cascade.ALL],
    orphanRemoval: true
  })
  estadias = new Collection<Estadia>(this);
}