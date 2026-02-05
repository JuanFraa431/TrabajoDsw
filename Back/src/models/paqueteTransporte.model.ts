import { BaseModel } from "../shared/db/baseModel.model.js";
import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Paquete } from "./paquete.model.js";
import { TipoTransporte } from "./tipoTransporte.model.js";
import { Ciudad } from "./ciudad.model.js";

@Entity({ tableName: "transporte_paquete" })
export class PaqueteTransporte extends BaseModel {
  @ManyToOne(() => Paquete, { nullable: false })
  paquete!: Rel<Paquete>;

  @ManyToOne(() => TipoTransporte, { nullable: false })
  tipoTransporte!: Rel<TipoTransporte>;

  @ManyToOne(() => Ciudad, { nullable: false })
  ciudadOrigen!: Rel<Ciudad>;

  @ManyToOne(() => Ciudad, { nullable: false })
  ciudadDestino!: Rel<Ciudad>;

  @Property({ nullable: false })
  fecha_salida!: Date;

  @Property({ nullable: false })
  fecha_llegada!: Date;

  @Property({ nullable: false })
  nombre_empresa!: string;

  @Property({ nullable: false })
  mail_empresa!: string;

  @Property({ nullable: false })
  capacidad!: number;

  @Property({ nullable: false })
  asientos_disponibles!: number;

  @Property({ nullable: false })
  precio!: number;

  @Property({ nullable: false })
  tipo!: "IDA" | "VUELTA";

  @Property({ nullable: true, default: true })
  activo?: boolean;
}
