import { BaseModel } from "../shared/db/baseModel.model.js";
import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Paquete } from "./paquete.model.js";
import { Excursion } from "./excursion.model.js";

@Entity()
export class PaqueteExcursion extends BaseModel {
  @ManyToOne(() => Paquete, { nullable: false })
  paquete!: Rel<Paquete>;

  @ManyToOne(() => Excursion, { nullable: false })
  excursion!: Rel<Excursion>;

  @Property({ nullable: false })
  fecha!: Date;
}
