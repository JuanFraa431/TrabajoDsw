import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Estadia } from './estadia.model.js';
import { Persona } from "./persona.model.js";
import { ReservaPaquete } from "./reservaPaquete.model.js";

@Entity()
export class Usuario extends Persona {
  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  estado!: number;

  @Property({ nullable: true })
  username!: string;

  @Property({ nullable: false, hidden: true })
  password!: string;

  @Property({ nullable: false })
  tipo_usuario!: string;

  @Property({ nullable: true })
  imagen!: string;

  @OneToMany(() => Estadia, (estadia) => estadia.usuario, {
    orphanRemoval: true,
    cascade: [Cascade.ALL]
  })
  estadias = new Collection<Estadia>(this);

    @OneToMany(() => ReservaPaquete, (rp) => rp.usuario, {
        orphanRemoval: true,
        cascade: [Cascade.ALL]
    })
    reservas = new Collection<ReservaPaquete>(this);
}


