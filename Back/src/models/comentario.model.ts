import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseModel } from '../shared/db/baseModel.model.js';
import { Usuario } from './usuario.model.js';
import { Paquete } from './paquete.model.js';

@Entity()
export class Comentario extends BaseModel {
  @ManyToOne(() => Usuario, { nullable: false })
  cliente!: Rel<Usuario>;

  @ManyToOne(() => Paquete, { nullable: false })
  paquete!: Rel<Paquete>;

  @Property({ nullable: false })
  fecha!: Date;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ nullable: false })
  estrellas!: number;
}
