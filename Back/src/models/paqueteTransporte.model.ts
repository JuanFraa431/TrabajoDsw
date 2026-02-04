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
  fecha!: Date;

  @Property({ nullable: false })
  tipo!: "IDA" | "VUELTA";
}
