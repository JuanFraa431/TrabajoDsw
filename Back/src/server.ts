import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { orm, syncSchema } from "./shared/db/orm.js";

import express from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { routerUsuario } from "./routes/usuario.routes.js";
import { routerCiudad } from "./routes/ciudad.routes.js";
import { routerHotel } from "./routes/hotel.routes.js";
import { routerExcursion } from "./routes/excursion.routes.js";
import { routerTransporte } from "./routes/transporte.routes.js";
import { routerPaquete } from "./routes/paquete.routes.js";
import { routerEstadia } from "./routes/estadia.routes.js";
import { routerComentario } from "./routes/comentario.routes.js";
import { routerReservaPaquete } from "./routes/reservaPaquete.routes.js";
import { routerPago } from "./routes/pago.routes.js";
import { routerPersona } from "./routes/persona.routes.js";
import { routerPaqueteExcursion } from "./routes/paqueteExcursion.routes.js";
import { routerPaqueteTransporte } from "./routes/paqueteTransporte.routes.js";
import { emailRouter } from "./routes/email.routes.js";
import { routerTipoTransporte } from "./routes/tipoTransporte.routes.js";
import { routerCancelacion } from "./routes/cancelacion.routes.js";
import { parseCorsOrigins, isAllowedCorsOrigin } from "./utils/configUtils.js";

import { RequestContext } from "@mikro-orm/core";

const app = express();

app.use(
  session({
    secret: "juamaqbrujan",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

const corsOrigins = parseCorsOrigins(
  process.env.CORS_ORIGINS,
  "http://localhost:8080,https://odysseytravels.infinityfreeapp.com",
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedCorsOrigin(origin, corsOrigins)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });
}

app.use("/api/cliente", routerUsuario);
app.use("/api/ciudad", routerCiudad);
app.use("/api/hotel", routerHotel);
app.use("/api/excursion", routerExcursion);
app.use("/api/transporte", routerTransporte);
app.use("/api/tipoTransporte", routerTipoTransporte);
app.use("/api/paquete", routerPaquete);
app.use("/api/estadia", routerEstadia);
app.use("/api/comentario", routerComentario);
app.use("/api/reservaPaquete", routerReservaPaquete);
app.use("/api/pago", routerPago);
app.use("/api/persona", routerPersona);
app.use("/api/paqueteExcursion", routerPaqueteExcursion);
app.use("/api/paqueteTransporte", routerPaqueteTransporte);
app.use("/api/email", emailRouter);
app.use("/api/cancelacion", routerCancelacion);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  console.log(`Iniciando el servidor en el puerto ${PORT}`);

  // Sincronizar esquema de base de datos antes de iniciar
  syncSchema().then(() => {
    console.log("Esquema de base de datos sincronizado");
    app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log(`Puedes abrir el servidor en: ${url}`);
    });
  }).catch((err) => {
    console.error("Error al sincronizar esquema:", err);
    app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log(`Puedes abrir el servidor en: ${url}`);
    });
  });
}

export { app };
