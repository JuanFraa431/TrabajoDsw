INSERT INTO `agenciadeviajes`.`ciudad` (`nombre`, `descripcion`, `pais`, `latitud`, `longitud`) VALUES
('Buenos Aires', 'Capital de Argentina', 'Argentina', -34.6037, -58.3816),
('Santiago', 'Capital de Chile', 'Chile', -33.4489, -70.6693),
('Lima', 'Capital de Perú', 'Perú', -12.0464, -77.0428),
('Bogotá', 'Capital de Colombia', 'Colombia', 4.711, -74.0721),
('Montevideo', 'Capital de Uruguay', 'Uruguay', -34.9011, -56.1645),
('Madrid', 'Capital de España', 'España', 40.4168, -3.7038),
('Paris', 'Capital de Francia', 'Francia', 48.8566, 2.3522),
('Roma', 'Capital de Italia', 'Italia', 41.9028, 12.4964),
('Ciudad de México', 'Capital de México', 'México', 19.4326, -99.1332),
('Nueva York', 'Ciudad más grande de EE.UU.', 'EE.UU.', 40.7128, -74.0060);

INSERT INTO `agenciadeviajes`.`cliente` (`nombre`, `apellido`, `dni`, `email`, `fecha_nacimiento`, `estado`, `username`, `password`, `tipo_usuario`, `imagen`) VALUES
('Juan', 'Pérez', '12345678', 'juan.perez@example.com', '1990-01-01', 1, 'juanperez', 'hashed_password1', 'cliente', 'juan.jpg'),
('María', 'González', '87654321', 'maria.gonzalez@example.com', '1985-05-12', 1, 'mariagonzalez', 'hashed_password2', 'cliente', 'maria.jpg'),
('Carlos', 'Rodríguez', '34567890', 'carlos.rodriguez@example.com', '1993-08-25', 1, 'carlosrodriguez', 'hashed_password3', 'cliente', 'carlos.jpg'),
('Ana', 'Martínez', '45678901', 'ana.martinez@example.com', '1988-11-10', 1, 'anamartinez', 'hashed_password4', 'cliente', 'ana.jpg'),
('Luis', 'Gómez', '56789012', 'luis.gomez@example.com', '1995-02-15', 1, 'luisgomez', 'hashed_password5', 'cliente', 'luis.jpg'),
('Lucía', 'Fernández', '67890123', 'lucia.fernandez@example.com', '1997-07-07', 1, 'luciafernandez', 'hashed_password6', 'cliente', 'lucia.jpg'),
('Pedro', 'López', '78901234', 'pedro.lopez@example.com', '1989-03-19', 1, 'pedrolopez', 'hashed_password7', 'cliente', 'pedro.jpg'),
('Sofía', 'Ramírez', '89012345', 'sofia.ramirez@example.com', '1992-12-30', 1, 'sofiaramirez', 'hashed_password8', 'cliente', 'sofia.jpg'),
('Jorge', 'Torres', '90123456', 'jorge.torres@example.com', '1994-06-18', 1, 'jorgetorres', 'hashed_password9', 'cliente', 'jorge.jpg'),
('Camila', 'Vargas', '01234567', 'camila.vargas@example.com', '1996-09-14', 1, 'camilavargas', 'hashed_password10', 'cliente', 'camila.jpg');

INSERT INTO `agenciadeviajes`.`excursion` (`nombre`, `descripcion`, `detalle`, `tipo`, `horario`, `nro_personas_max`, `nombre_empresa`, `mail_empresa`, `precio`, `ciudad_id`, `imagen`) VALUES
('Tour Histórico', 'Visita al centro histórico', 'Guía incluido', 'Cultural', '08:00', 30, 'Excursiones SA', 'info@excursiones.com', 50, 1, 'historico.jpg'),
('Aventura en la Montaña', 'Excursión por la cordillera', 'Incluye equipo básico', 'Aventura', '07:00', 20, 'Mountain Tours', 'contacto@mountaintours.com', 120, 2, 'montana.jpg'),
('Tour Gastronómico', 'Degustación de platos locales', 'Chef incluido', 'Gastronómico', '10:00', 25, 'Sabores Únicos', 'reservas@sabores.com', 80, 3, 'gastronomico.jpg'),
('Safari Fotográfico', 'Avistamiento de fauna', 'Guía experto', 'Naturaleza', '06:30', 15, 'Wildlife Expeditions', 'info@wildlife.com', 100, 4, 'safari.jpg'),
('Excursión a la Playa', 'Día de playa y deportes acuáticos', 'Incluye transporte', 'Relax', '09:00', 50, 'Beach Days', 'playas@beachdays.com', 70, 5, 'playa.jpg'),
('Circuito de Museos', 'Visita a los principales museos', 'Entrada incluida', 'Cultural', '11:00', 40, 'Museo Tour', 'info@museotour.com', 40, 6, 'museo.jpg'),
('Senderismo en el Bosque', 'Exploración de senderos naturales', 'Incluye refrigerio', 'Aventura', '07:30', 20, 'Nature Trails', 'contacto@naturetrails.com', 60, 7, 'bosque.jpg'),
('Tour Urbano', 'Recorrido por la ciudad', 'Guía en varios idiomas', 'Cultural', '09:30', 35, 'City Walks', 'info@citywalks.com', 45, 8, 'urbano.jpg'),
('Avistamiento de Aves', 'Observación de aves locales', 'Guía experto', 'Naturaleza', '06:00', 10, 'Birdwatching Co', 'aves@birdwatching.com', 110, 9, 'aves.jpg'),
('Excursión Nocturna', 'Visita a lugares icónicos por la noche', 'Incluye cena', 'Relax', '20:00', 25, 'Night Lights', 'reservas@nightlights.com', 90, 10, 'nocturna.jpg');

INSERT INTO `agenciadeviajes`.`hotel` (`nombre`, `descripcion`, `direccion`, `telefono`, `email`, `estrellas`, `ciudad_id`, `precio_x_dia`) VALUES
('Hotel Central', 'Hotel en el centro de la ciudad', 'Av. Principal 123', '123456789', 'central@hotel.com', 4, 1, 100),
('Hotel Andino', 'Alojamiento en la montaña', 'Calle Montaña 45', '234567890', 'andino@hotel.com', 5, 2, 200),
('Hotel Playa', 'Frente al mar con vista panorámica', 'Av. Costanera 78', '345678901', 'playa@hotel.com', 3, 3, 150),
('EcoLodge Selva', 'Hotel ecológico en la selva', 'Ruta Selva 56', '456789012', 'eco@lodge.com', 4, 4, 180),
('Gran Hotel Lux', 'Hotel de lujo en el centro', 'Av. Elite 10', '567890123', 'lux@hotel.com', 5, 5, 300),
('Hotel Histórico', 'Hotel cerca de sitios culturales', 'Calle Historia 89', '678901234', 'historico@hotel.com', 3, 6, 120),
('Bosque Lodge', 'Alojamiento en el bosque', 'Ruta Natural 22', '789012345', 'bosque@lodge.com', 4, 7, 140),
('Urban Hotel', 'Hotel moderno en la ciudad', 'Av. Metropolis 67', '890123456', 'urban@hotel.com', 4, 8, 170),
('Birdwatching Inn', 'Hotel para avistadores de aves', 'Calle Aves 90', '901234567', 'birds@inn.com', 3, 9, 130),
('Hotel Nocturno', 'Hotel especializado en turismo nocturno', 'Av. Noche 33', '012345678', 'nocturno@hotel.com', 5, 10, 220);

INSERT INTO `agenciadeviajes`.`paquete` (`nombre`, `estado`, `descripcion`, `detalle`, `precio`, `fecha_ini`, `fecha_fin`, `imagen`) VALUES
('Paquete Cultural', 1, 'Experiencia cultural única', 'Incluye museos y visitas guiadas', 500, '2026-01-01', '2027-01-07', 'cultural.jpg'),
('Aventura Extrema', 1, 'Paquete para los amantes de la adrenalina', 'Rafting, escalada y más', 700, '2026-02-01', '2027-02-10', 'aventura.jpg'),
('Relax Total', 1, 'Relájate en las mejores playas', 'Incluye spa y deportes acuáticos', 600, '2026-03-01', '2027-03-07', 'relax.jpg'),
('Naturaleza Salvaje', 1, 'Explora la selva y su biodiversidad', 'Safari y trekking', 800, '2026-04-01', '2027-04-07', 'naturaleza.jpg'),
('Lujo y Confort', 1, 'Hospedaje en hoteles 5 estrellas', 'Cena gourmet y tours privados', 1000, '2026-05-01', '2027-05-10', 'lujo.jpg'),
('Historia Viva', 1, 'Sumérgete en la historia de la región', 'Incluye sitios históricos y guías expertos', 550, '2026-06-01', '2027-06-07', 'historia.jpg'),
('Aventura en Familia', 1, 'Diversión asegurada para toda la familia', 'Parques temáticos y actividades grupales', 450, '2026-07-01', '2027-07-07', 'familia.jpg'),
('Descanso Natural', 1, 'Relájate rodeado de naturaleza', 'Cabañas y actividades al aire libre', 500, '2026-08-01', '2027-08-07', 'natural.jpg'),
('Turismo Urbano', 1, 'Explora las ciudades más vibrantes', 'Incluye transporte y guías locales', 550, '2026-09-01', '2027-09-07', 'urbano.jpg'),
('Escapada Romántica', 1, 'Paquete para parejas', 'Cena romántica y actividades especiales', 750, '2026-10-01', '2027-10-07', 'romantico.jpg');

INSERT INTO `agenciadeviajes`.`transporte` (`nombre`, `descripcion`, `capacidad`, `tipo`, `nombre_empresa`, `mail_empresa`) VALUES
('Bus de Lujo', 'Autobús con asientos reclinables y WiFi', 50, 'Terrestre', 'Viajes Confort', 'info@viajesconfort.com'),
('Lancha Rápida', 'Embarcación rápida para excursiones', 20, 'Acuático', 'Nautical Tours', 'reservas@nauticaltours.com'),
('Avión Privado', 'Vuelo exclusivo con servicio VIP', 8, 'Aéreo', 'SkyLux', 'contacto@skylux.com'),
('Barco Crucero', 'Crucero con cabinas de lujo', 200, 'Acuático', 'Cruceros del Caribe', 'info@cruceros.com'),
('Helicóptero', 'Transporte rápido y panorámico', 4, 'Aéreo', 'FlyHigh', 'contacto@flyhigh.com'),
('Camioneta 4x4', 'Vehículo para terrenos difíciles', 5, 'Terrestre', 'Adventure Rides', 'info@adventurerides.com'),
('Bicicleta', 'Opción ecológica para turismo urbano', 1, 'Terrestre', 'EcoBikes', 'contacto@ecobikes.com'),
('Tren Turístico', 'Tren con vistas panorámicas', 100, 'Terrestre', 'Railway Adventures', 'info@railwayadventures.com');

INSERT INTO `agenciadeviajes`.`estadia` (`paquete_id`, `hotel_id`, `fecha_ini`, `fecha_fin`, `precio_x_dia`, `cliente_id`) VALUES
(1, 1, '2024-01-01', '2024-01-07', 100, 1),
(2, 2, '2024-02-01', '2024-02-07', 120, 2),
(3, 3, '2024-03-01', '2024-03-07', 150, 3),
(4, 4, '2024-04-01', '2024-04-07', 180, 4),
(5, 5, '2024-05-01', '2024-05-07', 200, 5),
(6, 6, '2024-06-01', '2024-06-07', 220, 6),
(7, 7, '2024-07-01', '2024-07-07', 250, 7),
(8, 8, '2024-08-01', '2024-08-07', 300, 8),
(9, 9, '2024-09-01', '2024-09-07', 350, 9),
(10, 10, '2024-10-01', '2024-10-07', 400, 10);