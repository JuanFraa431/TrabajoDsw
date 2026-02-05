import { Entity, Property, Collection, OneToMany } from "@mikro-orm/core";
import { BaseModel } from "../shared/db/baseModel.model.js";
import { PaqueteTransporte } from "./paqueteTransporte.model.js";

@Entity()
export class TipoTransporte extends BaseModel {
  @Property({ nullable: false })
  nombre!: string; // 'Avión', 'Colectivo', etc.

  @OneToMany(
    () => PaqueteTransporte,
    (paqueteTransporte) => paqueteTransporte.tipoTransporte,
  )
  transportes = new Collection<PaqueteTransporte>(this);
}
