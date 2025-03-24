import { Entity, ManyToOne, Property, Rel} from "@mikro-orm/core";
import { BaseModel } from "../shared/db/baseModel.model.js";
import { MetodoDePago } from "./metodoDePago.model.js";

@Entity()
export class Pago extends BaseModel{
    @Property ({ nullable: true })
    fecha!: Date;

    @Property ({ nullable: true })
    monto!: number;

    @Property ({ nullable: true })
    estado!: string;

    @Property ({ nullable: true })
    factura!: string;

    @ManyToOne(() => MetodoDePago, { nullable: true })
    metodoDePago!: Rel<MetodoDePago>;
}