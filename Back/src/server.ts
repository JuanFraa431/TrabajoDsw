import 'reflect-metadata';
import { orm, syncSchema } from './shared/db/orm.js';

import express from 'express';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { routerUsuario } from './routes/usuario.routes.js';
import { routerCiudad } from './routes/ciudad.routes.js';
import { routerHotel } from './routes/hotel.routes.js';
import { routerExcursion } from './routes/excursion.routes.js';
import { routerTransporte } from './routes/transporte.routes.js';
import { routerPaquete } from './routes/paquete.routes.js';
import { routerEstadia } from './routes/estadia.routes.js';
import { routerComentario } from './routes/comentario.routes.js';
import { routerReservaPaquete } from './routes/reservaPaquete.routes.js';
import { routerPago } from './routes/pago.routes.js';
import { routerPersona } from './routes/persona.routes.js';
import { routerPaqueteExcursion } from './routes/paqueteExcursion.routes.js';
import { emailRouter } from './routes/email.routes.js';

import { RequestContext } from '@mikro-orm/core';

const app = express();

app.use(
  session({
    secret: 'juamaqbrujan', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use(express.json());

app.use( (req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/cliente', routerUsuario);
app.use('/api/ciudad', routerCiudad);
app.use('/api/hotel',routerHotel);
app.use('/api/excursion', routerExcursion);
app.use('/api/transporte', routerTransporte);
app.use('/api/paquete', routerPaquete);
app.use('/api/estadia', routerEstadia);
app.use('/api/comentario', routerComentario);
app.use('/api/reservaPaquete', routerReservaPaquete);
app.use('/api/pago', routerPago);
app.use('/api/persona', routerPersona);
app.use('/api/paqueteExcursion', routerPaqueteExcursion);
app.use('/api/email', emailRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.use(passport.initialize());
passport.use(new GoogleStrategy(
  {
    clientID: "1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8080/login",
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));


app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

console.log(`Iniciando el servidor en el puerto ${PORT}`);

await syncSchema(); // solo para desarrollo

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Puedes abrir el servidor en: ${url}`);
});