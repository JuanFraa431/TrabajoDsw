import { BaseModel } from "../shared/db/baseModel.model.js";
import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Paquete } from "./paquete.model.js";
import { Transporte } from "./transporte.model.js";

@Entity()
export class PaqueteTransporte extends BaseModel {
  @ManyToOne(() => Paquete, { nullable: false })
  paquete!: Rel<Paquete>;

  @ManyToOne(() => Transporte, { nullable: false })
  transporte!: Rel<Transporte>;

  @Property({ nullable: false })
  dia!: string;

  @Property({ nullable: false })
  horario!: string;

  @Property({ nullable: false })
  precio!: number;

  @Property({ nullable: false, default: true })
  es_ida!: boolean;
}
