import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface ReservaEmailData {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  paquete: {
    id: number;
    nombre: string;
    descripcion: string;
    detalle: string;
    fecha_ini?: string | null;
    fecha_fin?: string | null;
    precio?: number;
    imagen: string;
    estadias?: any[];
    paqueteExcursiones?: any[];
  };
  reserva: {
    id: number;
    fecha_reserva: string;
    cantidad_personas: number;
    precio_total: number;
    estado: string;
  };
  acompanantes?: any[];
}

class EmailService {
  private transporter;
  private enabled;

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const service = process.env.EMAIL_SERVICE;
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT
      ? Number(process.env.EMAIL_PORT)
      : undefined;

    this.enabled = Boolean(user && pass && (service || host));

    this.transporter = nodemailer.createTransport({
      service: service,
      host: host,
      port: port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private calcularDiasPaquete(
    fechaIni?: string | null,
    fechaFin?: string | null,
  ): number {
    if (!fechaIni || !fechaFin) return 0;
    const inicio = new Date(fechaIni);
    const fin = new Date(fechaFin);
    const dias = Math.ceil(
      (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24),
    );
    return dias;
  }

  private formatearDuracion(
    fechaIni?: string | null,
    fechaFin?: string | null,
  ): string {
    const dias = this.calcularDiasPaquete(fechaIni, fechaFin);
    if (dias === 0) return "Duración no especificada";
    if (dias === 1) return "1 día";

    const noches = dias - 1;
    if (noches <= 0) return `${dias} día${dias > 1 ? "s" : ""}`;

    return `${dias} día${dias > 1 ? "s" : ""}, ${noches} noche${
      noches > 1 ? "s" : ""
    }`;
  }

  private formatearFecha(fecha?: string | null): string {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  private calcularEdad(fechaNacimiento?: string | Date | null): number | null {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) return null;

    const nacimientoUTC = new Date(
      Date.UTC(
        nacimiento.getUTCFullYear(),
        nacimiento.getUTCMonth(),
        nacimiento.getUTCDate(),
      ),
    );
    const hoy = new Date();
    const hoyUTC = new Date(
      Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()),
    );

    let edad = hoyUTC.getUTCFullYear() - nacimientoUTC.getUTCFullYear();
    const mes = hoyUTC.getUTCMonth() - nacimientoUTC.getUTCMonth();
    if (
      mes < 0 ||
      (mes === 0 && hoyUTC.getUTCDate() < nacimientoUTC.getUTCDate())
    ) {
      edad--;
    }
    return edad;
  }

  private generarHtmlRechazoReserva(
    data: ReservaEmailData & { motivo: string },
  ): string {
    const { usuario, paquete, reserva, motivo } = data;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva Rechazada</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 1.1rem;
            color: #2d3748;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border-radius: 10px;
            border-left: 4px solid #f56565;
        }

        .motivo-box {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            padding: 25px;
            border-radius: 15px;
            margin: 30px 0;
            border-left: 5px solid #e53e3e;
        }

        .motivo-box h3 {
            color: #e53e3e;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .motivo-box p {
            color: #2d3748;
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .package-info {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            border: 2px solid #e2e8f0;
        }

        .package-title {
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .package-subtitle {
            color: #4a5568;
            font-size: 1.1rem;
            margin-bottom: 20px;
        }

        .package-image {
            width: 100%;
            max-width: 500px;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-top: 15px;
            opacity: 0.7;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
        }

        .info-card h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.2rem;
            border-bottom: 2px solid #f56565;
            padding-bottom: 10px;
        }

        .info-card p {
            color: #4a5568;
            margin-bottom: 8px;
        }

        .divider {
            border: none;
            border-top: 2px dashed #cbd5e0;
            margin: 30px 0;
        }

        .next-steps {
            background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            padding: 25px;
            border-radius: 15px;
            margin-top: 30px;
            border-left: 5px solid #4299e1;
        }

        .next-steps h3 {
            color: #2c5282;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .next-steps ul {
            color: #2d3748;
            padding-left: 25px;
        }

        .next-steps li {
            margin-bottom: 10px;
            line-height: 1.8;
        }

        .footer {
            background: #2d3748;
            color: white;
            padding: 30px;
            text-align: center;
        }

        .footer p {
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .contact-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        @media only screen and (max-width: 600px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .package-title {
                font-size: 1.6rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>❌ Reserva Rechazada</h1>
            <p>Lamentamos informarte sobre tu reserva</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hola <strong>${usuario.nombre} ${usuario.apellido}</strong>,<br>
                Lamentamos informarte que tu solicitud de reserva no ha podido ser aprobada. A continuación te explicamos el motivo y qué pasos puedes seguir.
            </div>

            <div class="motivo-box">
                <h3>📋 Motivo del Rechazo</h3>
                <p>${motivo}</p>
            </div>
            
            <div class="package-info">
                <h2 class="package-title">${paquete.nombre}</h2>
                <p class="package-subtitle">${paquete.descripcion}</p>
                <img src="${paquete.imagen}" alt="${paquete.nombre}" class="package-image" onerror="this.style.display='none'">
            </div>

            <div class="info-grid">
                <div class="info-card">
                    <h3>📅 Fechas Solicitadas</h3>
                    <p><strong>Inicio:</strong> ${this.formatearFecha(paquete.fecha_ini)}</p>
                    <p><strong>Fin:</strong> ${this.formatearFecha(paquete.fecha_fin)}</p>
                </div>
                
                <div class="info-card">
                    <h3>🎫 Detalles de Solicitud</h3>
                    <p><strong>Número:</strong> #${reserva.id}</p>
                    <p><strong>Fecha:</strong> ${new Date(reserva.fecha_reserva).toLocaleDateString("es-ES")}</p>
                    <p><strong>Estado:</strong> <span style="color: #e53e3e; font-weight: 600;">❌ RECHAZADA</span></p>
                </div>
            </div>

            <hr class="divider">

            <div class="next-steps">
                <h3>🔄 Próximos Pasos</h3>
                <ul>
                    <li>Puedes realizar una nueva reserva corrigiendo la información según el motivo indicado</li>
                    <li>Si tienes dudas sobre el rechazo, contáctanos directamente</li>
                    <li>Revisa otros paquetes disponibles que puedan interesarte</li>
                    <li>Nuestro equipo está disponible para ayudarte con cualquier consulta</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>¿Necesitas ayuda?</strong></p>
            <p>Estamos aquí para asistirte. No dudes en contactarnos si tienes alguna pregunta.</p>
            
            <div class="contact-info">
                <p>📧 Email: juanfraa032@gmail.com</p>
                <p>🌐 www.tupaqueteturismo.com</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
                © 2026 Tu Paquete Turismo. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generarHtmlConfirmacionPago(data: ReservaEmailData): string {
    const { usuario, paquete, reserva, acompanantes } = data;
    const duracion = this.formatearDuracion(
      paquete.fecha_ini,
      paquete.fecha_fin,
    );

    const estadiasHtml =
      paquete.estadias
        ?.map(
          (estadia) => `
      <div class="item-card">
        <div class="item-header">
          <h4>🏨 ${estadia.hotel?.nombre || "Hotel"}</h4>
        </div>
        <div class="item-details">
          <p><strong>Dirección:</strong> ${
            estadia.hotel?.direccion || "No especificada"
          }</p>
          <p><strong>Check-in:</strong> ${new Date(
            estadia.fecha_ini,
          ).toLocaleDateString("es-ES")}</p>
          <p><strong>Check-out:</strong> ${new Date(
            estadia.fecha_fin,
          ).toLocaleDateString("es-ES")}</p>
          <p><strong>Precio por día:</strong> ${estadia.hotel?.precio_x_dia != null ? "$" + estadia.hotel.precio_x_dia : "No especificado"}</p>
        </div>
      </div>
    `,
        )
        .join("") || "<p>No hay estadías especificadas</p>";

    const excursionesHtml =
      paquete.paqueteExcursiones
        ?.map(
          (paqueteExc) => `
        <div class="item-card">
            <div class="item-header">
            <h4>🎯 ${paqueteExc.excursion?.nombre || "Excursión"}</h4>
            </div>
            <div class="item-details">
            <p><strong>Descripción:</strong> ${
              paqueteExc.excursion?.descripcion || "No especificada"
            }</p>
            <p><strong>Fecha:</strong> ${this.formatearFecha(paqueteExc.fecha)}</p>
            <p><strong>Precio:</strong> ${paqueteExc.excursion?.precio != null ? "$" + paqueteExc.excursion.precio : "No especificado"}</p>
            </div>
        </div>
    `,
        )
        .join("") || "<p>No hay excursiones incluidas</p>";

    const acompanantesHtml =
      acompanantes
        ?.map(
          (acompanante) => `
            <div class="companion-item">
                <span class="companion-name">${acompanante.nombre} ${acompanante.apellido}</span>
                                <span class="companion-age">${
                                  this.calcularEdad(
                                    acompanante.fecha_nacimiento,
                                  ) !== null
                                    ? `Edad: ${this.calcularEdad(acompanante.fecha_nacimiento)} años`
                                    : ""
                                }</span>
            </div>
        `,
        )
        .join("") || "<p>No hay acompañantes</p>";

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Reserva Confirmada!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 1.1rem;
            color: #2d3748;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            border-radius: 10px;
            border-left: 4px solid #48bb78;
        }

        .package-hero {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            border: 2px solid #e2e8f0;
        }

        .package-title {
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .package-subtitle {
            color: #4a5568;
            font-size: 1.1rem;
            margin-bottom: 20px;
        }

        .package-image {
            width: 100%;
            max-width: 500px;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-top: 15px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .info-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .info-card h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.2rem;
            border-bottom: 2px solid #48bb78;
            padding-bottom: 10px;
        }

        .info-card p {
            color: #4a5568;
            margin-bottom: 8px;
        }

        .divider {
            border: none;
            border-top: 2px dashed #cbd5e0;
            margin: 30px 0;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            color: #2d3748;
            font-size: 1.5rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #48bb78;
        }

        .item-card {
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 15px;
            border-left: 4px solid #48bb78;
        }

        .item-header h4 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .item-details p {
            color: #4a5568;
            margin-bottom: 8px;
            padding-left: 10px;
        }

        .companions-list {
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #48bb78;
        }

        .companion-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .companion-name {
            font-weight: 600;
            color: #2d3748;
        }

        .companion-age {
            color: #718096;
            font-size: 0.95rem;
        }

        .price-summary {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin-top: 30px;
        }

        .price-label {
            font-size: 1.2rem;
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .price-amount {
            font-size: 3rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .footer {
            background: #2d3748;
            color: white;
            padding: 30px;
            text-align: center;
        }

        .footer p {
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .contact-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        @media only screen and (max-width: 600px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .package-title {
                font-size: 1.6rem;
            }
            
            .price-amount {
                font-size: 2.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 ¡Reserva Confirmada!</h1>
            <p>Tu pago ha sido verificado y aprobado</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                ¡Excelentes noticias, <strong>${usuario.nombre} ${usuario.apellido}</strong>! 🎊<br>
                Tu pago ha sido verificado y aceptado exitosamente. Tu reserva está confirmada y lista para tu próxima aventura. ¡Prepárate para vivir una experiencia inolvidable!
            </div>
            
            <div class="package-hero">
                <h2 class="package-title">${paquete.nombre}</h2>
                <p class="package-subtitle">${paquete.descripcion}</p>
                <img src="${paquete.imagen}" alt="${paquete.nombre}" class="package-image" onerror="this.style.display='none'">
            </div>

            <div class="info-grid">
                                <div class="info-card">
                                        <h3>📅 Fechas del Viaje</h3>
                                        <p><strong>Inicio:</strong> ${this.formatearFecha(paquete.fecha_ini)}</p>
                                        <p><strong>Fin:</strong> ${this.formatearFecha(paquete.fecha_fin)}</p>
                                        <p><strong>Duración:</strong> ${duracion}</p>
                                </div>
                
                <div class="info-card">
                    <h3>🎫 Detalles de Reserva</h3>
                    <p><strong>Número:</strong> #${reserva.id}</p>
                    <p><strong>Fecha:</strong> ${new Date(reserva.fecha_reserva).toLocaleDateString("es-ES")}</p>
                    <p><strong>Estado:</strong> <span style="color: #48bb78; font-weight: 600;">✅ CONFIRMADA</span></p>
                    <p><strong>Personas:</strong> ${reserva.cantidad_personas}</p>
                </div>

                <div class="info-card">
                    <h3>📧 Información de Contacto</h3>
                    <p><strong>Email:</strong> ${usuario.email}</p>
                    <p><strong>Confirmada el:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
                </div>
            </div>

            <hr class="divider">

            <div class="section">
                <h3 class="section-title">🏨 Alojamientos Incluidos</h3>
                ${estadiasHtml}
            </div>

            <div class="section">
                <h3 class="section-title">🎯 Actividades y Excursiones</h3>
                ${excursionesHtml}
            </div>

            ${
              acompanantes && acompanantes.length > 0
                ? `
            <div class="section">
                <h3 class="section-title">👥 Acompañantes (${acompanantes.length})</h3>
                <div class="companions-list">
                    ${acompanantesHtml}
                </div>
            </div>
            `
                : ""
            }

            <div class="price-summary">
                <div class="price-label">💰 Total Pagado</div>
                <div class="price-amount">$${reserva.precio_total.toLocaleString("es-AR")}</div>
                <p style="margin-top: 15px; opacity: 0.9;">Pago verificado y confirmado ✅</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>¿Tienes alguna pregunta?</strong></p>
            <p>No dudes en contactarnos. Estamos aquí para ayudarte a que tu viaje sea perfecto.</p>
            
            <div class="contact-info">
                <p>📧 Email: juanfraa032@gmail.com</p>
                <p>🌐 www.tupaqueteturismo.com</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
                © 2026 Tu Paquete Turismo. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private generarHtmlReserva(data: ReservaEmailData): string {
    const { usuario, paquete, reserva, acompanantes } = data;
    const duracion = this.formatearDuracion(
      paquete.fecha_ini,
      paquete.fecha_fin,
    );

    const estadiasHtml =
      paquete.estadias
        ?.map(
          (estadia) => `
      <div class="item-card">
        <div class="item-header">
          <h4>🏨 ${estadia.hotel?.nombre || "Hotel"}</h4>
        </div>
        <div class="item-details">
          <p><strong>Dirección:</strong> ${
            estadia.hotel?.direccion || "No especificada"
          }</p>
          <p><strong>Check-in:</strong> ${new Date(
            estadia.fecha_ini,
          ).toLocaleDateString("es-ES")}</p>
          <p><strong>Check-out:</strong> ${new Date(
            estadia.fecha_fin,
          ).toLocaleDateString("es-ES")}</p>
          <p><strong>Precio por día:</strong> ${estadia.hotel?.precio_x_dia != null ? "$" + estadia.hotel.precio_x_dia : "No especificado"}</p>
        </div>
      </div>
    `,
        )
        .join("") || "<p>No hay estadías especificadas</p>";

    // Generar lista de excursiones
    const excursionesHtml =
      paquete.paqueteExcursiones
        ?.map(
          (paqueteExc) => `
        <div class="item-card">
            <div class="item-header">
            <h4>🎯 ${paqueteExc.excursion?.nombre || "Excursión"}</h4>
            </div>
            <div class="item-details">
            <p><strong>Descripción:</strong> ${
              paqueteExc.excursion?.descripcion || "No especificada"
            }</p>
            <p><strong>Fecha:</strong> ${this.formatearFecha(paqueteExc.fecha)}</p>
            <p><strong>Precio:</strong> ${paqueteExc.excursion?.precio != null ? "$" + paqueteExc.excursion.precio : "No especificado"}</p>
            </div>
        </div>
    `,
        )
        .join("") || "<p>No hay excursiones incluidas</p>";

    // Generar lista de acompañantes
    const acompanantesHtml =
      acompanantes
        ?.map(
          (acompanante) => `
            <div class="companion-item">
                <span class="companion-name">${acompanante.nombre} ${acompanante.apellido}</span>
                                <span class="companion-age">${
                                  this.calcularEdad(
                                    acompanante.fecha_nacimiento,
                                  ) !== null
                                    ? `Edad: ${this.calcularEdad(acompanante.fecha_nacimiento)} años`
                                    : ""
                                }</span>
            </div>
        `,
        )
        .join("") || "<p>Solo el titular</p>";

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Reserva Recibida</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 123, 255, 0.15);
            overflow: hidden;
            position: relative;
        }

        .header {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 20%, transparent 20%);
            background-size: 40px 40px;
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translateX(-50px) translateY(-50px) rotate(0deg); }
            100% { transform: translateX(-50px) translateY(-50px) rotate(360deg); }
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 300;
        }

        .content {
            padding: 50px 40px;
        }

        .greeting {
            font-size: 1.3rem;
            color: #2d3748;
            margin-bottom: 40px;
            text-align: center;
            font-weight: 500;
        }

        .package-hero {
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 86, 179, 0.08) 100%);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 40px;
            border: 1px solid rgba(0, 123, 255, 0.15);
            position: relative;
            overflow: hidden;
        }

        .package-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #007bff, #0056b3);
        }

        .package-title {
            font-size: 2rem;
            background: linear-gradient(135deg, #007bff, #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
        }

        .package-subtitle {
            color: #718096;
            text-align: center;
            font-size: 1.1rem;
            margin-bottom: 30px;
        }

        .package-image {
            width: 100%;
            max-width: 500px;
            height: 250px;
            object-fit: cover;
            border-radius: 16px;
            margin: 25px auto;
            display: block;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin: 40px 0;
        }

        .info-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 25px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
            position: relative;
        }

        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 123, 255, 0.15);
            border-color: rgba(0, 123, 255, 0.3);
        }

        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #007bff, #0056b3);
            border-radius: 16px 16px 0 0;
        }

        .info-card h3 {
            background: linear-gradient(135deg, #007bff, #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .info-card p {
            color: #4a5568;
            margin: 8px 0;
            font-weight: 500;
        }

        .section {
            margin: 50px 0;
        }

        .section-title {
            font-size: 1.6rem;
            background: linear-gradient(135deg, #007bff, #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
        }

        .item-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }

        .item-card:hover {
            box-shadow: 0 12px 30px rgba(0, 123, 255, 0.15);
            transform: translateY(-3px);
            border-color: rgba(0, 123, 255, 0.3);
        }

        .item-header {
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(0, 86, 179, 0.05) 100%);
            padding: 20px 25px;
            border-bottom: 1px solid #e2e8f0;
        }

        .item-header h4 {
            background: linear-gradient(135deg, #007bff, #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            font-size: 1.3rem;
            font-weight: 600;
        }

        .item-details {
            padding: 25px;
        }

        .item-details p {
            color: #4a5568;
            margin: 10px 0;
            font-weight: 500;
        }

        .item-details strong {
            color: #2d3748;
            font-weight: 600;
        }

        .price-summary {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            border-radius: 20px;
            padding: 35px;
            margin: 40px 0;
            border: 1px solid rgba(102, 126, 234, 0.15);
            text-align: center;
        }

        .price-amount {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #007bff, #0056b3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }

        .price-label {
            color: #718096;
            font-size: 1.1rem;
            margin-bottom: 20px;
        }

        .companions-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .companion-item {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            text-align: center;
            transition: all 0.3s ease;
        }

        .companion-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 123, 255, 0.1);
        }

        .companion-name {
            display: block;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }

        .companion-age {
            color: #718096;
            font-size: 0.9rem;
        }

        .contact-info {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }

        .contact-info::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.05) 30%, transparent 30%);
            background-size: 20px 20px;
        }

        .contact-info h4 {
            margin-bottom: 15px;
            font-size: 1.3rem;
            position: relative;
            z-index: 1;
        }

        .contact-info p {
            margin: 8px 0;
            position: relative;
            z-index: 1;
            opacity: 0.95;
        }

        .footer {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .footer p {
            margin: 10px 0;
            opacity: 0.9;
        }

        .footer strong {
            color: #90cdf4;
        }

        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
            margin: 40px 0;
            border: none;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 16px;
            }
            
            .header, .content {
                padding: 30px 20px;
            }
            
            .package-hero {
                padding: 25px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .package-title {
                font-size: 1.6rem;
            }
            
            .price-amount {
                font-size: 2.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>✅ ¡Solicitud Recibida!</h1>
            <p>Tu solicitud de reserva está siendo procesada</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                ¡Hola <strong>${usuario.nombre} ${usuario.apellido}</strong>! 👋<br>
                Hemos recibido tu solicitud de reserva. Nuestro equipo está verificando tu pago y te enviaremos un correo con la confirmación o rechazo en las próximas horas. Aquí tienes los detalles de tu solicitud:
            </div>
            
            <div class="package-hero">
                <h2 class="package-title">${paquete.nombre}</h2>
                <p class="package-subtitle">${paquete.descripcion}</p>
                <img src="${paquete.imagen}" alt="${paquete.nombre}" class="package-image" onerror="this.style.display='none'">
            </div>

            <div class="info-grid">
                <div class="info-card">
                    <h3>📅 Fechas del Viaje</h3>
                                        <p><strong>Inicio:</strong> ${this.formatearFecha(paquete.fecha_ini)}</p>
                                        <p><strong>Fin:</strong> ${this.formatearFecha(paquete.fecha_fin)}</p>
                    <p><strong>Duración:</strong> ${duracion}</p>
                </div>
                
                <div class="info-card">
                    <h3>🎫 Detalles de Reserva</h3>
                    <p><strong>Número:</strong> #${reserva.id}</p>
                    <p><strong>Fecha:</strong> ${new Date(reserva.fecha_reserva).toLocaleDateString("es-ES")}</p>
                    <p><strong>Estado:</strong> <span style="color: #48bb78; font-weight: 600;">✅ ${reserva.estado.toUpperCase()}</span></p>
                    <p><strong>Personas:</strong> ${reserva.cantidad_personas}</p>
                </div>

                <div class="info-card">
                    <h3>📧 Información de Contacto</h3>
                    <p><strong>Email:</strong> ${usuario.email}</p>
                    <p><strong>Reservado el:</strong> ${new Date(reserva.fecha_reserva).toLocaleDateString("es-ES")}</p>
                </div>
            </div>

            <hr class="divider">

            <div class="section">
                <h3 class="section-title">🏨 Alojamientos Incluidos</h3>
                ${estadiasHtml}
            </div>

            <div class="section">
                <h3 class="section-title">🎯 Actividades y Excursiones</h3>
                ${excursionesHtml}
            </div>

            ${
              acompanantes && acompanantes.length > 0
                ? `
            <div class="section">
                <h3 class="section-title">👥 Acompañantes</h3>
                <div class="companions-section">
                    ${acompanantesHtml}
                </div>
            </div>`
                : ""
            }

            <hr class="divider">

            <div class="price-summary">
                <div class="price-amount">$${reserva.precio_total.toLocaleString("es-ES")}</div>
                <div class="price-label">Precio Total del Paquete</div>
                <p style="color: #718096; font-size: 0.9rem; margin-top: 15px;">
                    Incluye todos los servicios detallados • ${reserva.cantidad_personas} persona${reserva.cantidad_personas > 1 ? "s" : ""}
                </p>
            </div>

            <div class="contact-info">
                <h4>📞 ¿Necesitas ayuda con tu reserva?</h4>
                <p>Nuestro equipo está disponible para asistirte con cualquier consulta sobre tu viaje.</p>
                <p><strong>📧 Email:</strong> reservas@oddyseytravels.com</p>
                <p><strong>📱 WhatsApp:</strong> +54 9 11 1234-5678</p>
                <p><strong>🕐 Horarios:</strong> Lunes a Viernes 9:00 - 18:00</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>¡Gracias por elegirnos para tu próxima aventura! 🌟</strong></p>
            <p>Esperamos que disfrutes cada momento de tu viaje</p>
            <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                Oddysey Travels © 2025<br>
                Este es un email automático, por favor no respondas a este mensaje.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  async enviarEmailReserva(data: ReservaEmailData): Promise<void> {
    if (!this.enabled) {
      console.warn(
        "EmailService deshabilitado: faltan credenciales o configuración SMTP.",
      );
      return;
    }
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || "juanfraa032@gmail.com",
        to: data.usuario.email,
        subject: `⏳ Solicitud de Reserva Recibida - ${data.paquete.nombre}`,
        html: this.generarHtmlReserva(data),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email de confirmación enviado a: ${data.usuario.email}`);
    } catch (error) {
      console.error("Error al enviar email de confirmación:", error);
      throw error;
    }
  }
  async enviarConfirmacionPago(data: ReservaEmailData): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || "juanfraa032@gmail.com",
        to: data.usuario.email,
        subject: `🎉 ¡Reserva Confirmada! - ${data.paquete.nombre}`,
        html: this.generarHtmlConfirmacionPago(data),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(
        `Email de confirmación de pago enviado a: ${data.usuario.email}`,
      );
    } catch (error) {
      console.error("Error al enviar email de confirmación de pago:", error);
      throw error;
    }
  }

  async enviarRechazoReserva(
    data: ReservaEmailData & { motivo: string },
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || "juanfraa032@gmail.com",
        to: data.usuario.email,
        subject: `❌ Reserva Rechazada - ${data.paquete.nombre}`,
        html: this.generarHtmlRechazoReserva(data),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email de rechazo enviado a: ${data.usuario.email}`);
    } catch (error) {
      console.error("Error al enviar email de rechazo:", error);
      throw error;
    }
  }

  async verificarConexion(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ Conexión SMTP verificada exitosamente");
      return true;
    } catch (error) {
      console.error("❌ Error en la conexión SMTP:", error);
      return false;
    }
  }

  async enviarEmailPrueba(destinatario: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || "juanfraa032@gmail.com",
        to: destinatario,
        subject: "🧪 Email de Prueba - Sistema de Reservas",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #007bff;">Email de Prueba</h2>
                        <p>Si recibes este email, la configuración SMTP está funcionando correctamente.</p>
                        <p>Fecha: ${new Date().toLocaleString()}</p>
                        <hr style="border: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #666;">
                            Este es un email de prueba del Sistema de Reservas de Paquetes Turísticos.
                        </p>
                    </div>
                `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de prueba enviado exitosamente a: ${destinatario}`);
      return true;
    } catch (error) {
      console.error("❌ Error al enviar email de prueba:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
