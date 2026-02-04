import { Entity, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseModel } from "../shared/db/baseModel.model.js";
import { ReservaPaquete } from "./reservaPaquete.model.js";

export enum PagoEstado {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
}

@Entity()
export class Pago extends BaseModel {
  @Property({ nullable: true })
  fecha!: Date;

  @Property({ nullable: true })
  monto!: number;

  @Property({ nullable: true })
  estado!: PagoEstado;

  @Property({ nullable: true })
  metodoDePago!: string;

  // DATOS DE FACTURACION
  @Property({ nullable: true })
  tipoFactura!: string;

  @Property({ nullable: true })
  nombreFacturacion!: string;

  @Property({ nullable: true })
  apellidoFacturacion!: string;

  @Property({ nullable: true })
  dniFacturacion!: string;

  @Property({ nullable: true })
  telefonoFacturacion!: string;

  @Property({ nullable: true })
  emailFacturacion!: string;

  // DATOS DE TARJETA
  @Property({ nullable: true })
  nombreTitular!: string;

  @Property({ nullable: true })
  ultimos4!: string;

  @Property({ nullable: true })
  proveedor!: string; // Ej: "Stripe", "MercadoPago"

  @Property({ nullable: true })
  transaccionId!: string; // ID del proveedor (para reclamos o auditoría)
}
