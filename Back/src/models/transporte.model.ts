import { Entity, Property } from '@mikro-orm/core';
import { BaseModel } from '../shared/db/baseModel.model.js';

@Entity()
export class Transporte extends BaseModel {

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;
  
  @Property({ nullable: false })
  capacidad!: number;
  
  @Property({ nullable: false })
  tipo!: string;
  
  @Property({ nullable: false })
  nombre_empresa!: string;
  
  @Property({ nullable: false })
  mail_empresa!: string;
}
