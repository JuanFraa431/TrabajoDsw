import { Entity, OneToMany, Property, Collection } from "@mikro-orm/core";
import { BaseModel } from "../shared/db/baseModel.model.js";
import { Pago } from "./pago.model.js";

@Entity()
export class MetodoDePago extends BaseModel{
    @Property ({ nullable: true })
    nombre!: string;

    @Property ({ nullable: true })
    tipo!: string;

    @Property ({ nullable: true })
    estado!: string;

    @OneToMany(() => Pago, (p) => p.metodoDePago)
    pagos = new Collection<Pago>(this);
}