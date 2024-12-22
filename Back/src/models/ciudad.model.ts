import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseModel } from "../shared/db/baseModel.model.js";
import { Hotel } from "./hotel.model.js";
import { Excursion } from "./excursion.model.js";

@Entity()
export class Ciudad extends BaseModel {

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ nullable: false })
  pais!: string;

  @Property({ nullable: false })
  latitud!: string;

  @Property({ nullable: false })
  longitud!: string;

  @OneToMany( () => Hotel, (hotel) => hotel.ciudad, { cascade: [Cascade.ALL] })
  hoteles = new Collection<Hotel>(this);
  
  @OneToMany( () => Excursion, (excursion) => excursion.ciudad, { cascade: [Cascade.ALL] })
  excursiones = new Collection<Excursion>(this);
}