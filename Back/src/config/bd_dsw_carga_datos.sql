-- Inserciones en tabla 'ciudades'
INSERT INTO ciudades (nombre, descripcion, pais)
VALUES
('Buenos Aires', 'Capital de Argentina', 'Argentina'),
('Madrid', 'Capital de España', 'España'),
('Nueva York', 'Ciudad en Estados Unidos', 'Estados Unidos');

-- Inserciones en tabla 'transportes'
INSERT INTO transportes (descripcion, capacidad, tipo, nombre_empresa, mail_empresa)
VALUES
('Autobús de turismo', 50, 'Autobús', 'Turismo SRL', 'contacto@turismosrl.com'),
('Avión comercial', 180, 'Avión', 'Aerolíneas Argentinas', 'info@aerolineas.com.ar'),
('Tren de alta velocidad', 300, 'Tren', 'Renfe', 'contacto@renfe.com');

-- Inserciones en tabla 'hoteles'
INSERT INTO hoteles (nombre, direccion, descripcion, telefono, email, estrellas, id_ciudad)
VALUES
('Hotel Hilton', 'Av. Santa Fe 123', 'Hotel 5 estrellas de lujo', '123456789', 'hilton@hoteles.com', 5, 1),
('NH Collection', 'Calle de Alcalá 345', 'Hotel céntrico en Madrid', '987654321', 'nh@hoteles.com', 4, 2),
('The Plaza', '5th Avenue 768', 'Hotel de lujo en Nueva York', '1122334455', 'plaza@hoteles.com', 5, 3);

-- Inserciones en tabla 'paquetes'
INSERT INTO paquetes (estado, descripcion, precio, fecha_ini, fecha_fin)
VALUES
(true, 'Paquete completo a Buenos Aires', 1200.50, '2024-11-01', '2024-11-05'),
(true, 'Paquete turístico a Madrid', 1500.75, '2024-12-01', '2024-12-06'),
(false, 'Paquete de lujo a Nueva York', 3000.00, '2025-01-01', '2025-01-07');

-- Inserciones en tabla 'clientes'
INSERT INTO clientes (nombre, apellido, dni, email, fecha_nacimiento, estado)
VALUES
('Juan', 'Pérez', '12345678', 'juan.perez@mail.com', '1980-05-15', true),
('María', 'Gómez', '87654321', 'maria.gomez@mail.com', '1990-03-10', true),
('Pedro', 'Fernández', '45678912', 'pedro.fernandez@mail.com', '1985-07-20', false);

-- Inserciones en tabla 'excursiones'
INSERT INTO excursiones (nombre, tipo, descripcion, horario, nro_personas_max, nombre_empresa, mail_empresa, precio, id_ciudad)
VALUES
('City Tour Buenos Aires', 'Cultural', 'Recorrido por los principales puntos turísticos', '10:00:00', 30, 'Turismo BA', 'info@turismoba.com', 50.00, 1),
('Tour por el Prado', 'Museo', 'Visita guiada por el Museo del Prado', '11:00:00', 25, 'Cultura Madrid', 'info@culturamadrid.com', 45.00, 2),
('Tour Estatua de la Libertad', 'Monumento', 'Excursión en barco hacia la Estatua de la Libertad', '09:00:00', 50, 'NYC Tours', 'info@nyctours.com', 70.00, 3);

-- Inserciones en tabla 'paquete_excursion'
INSERT INTO paquete_excursion (id_paquete, id_excursion, fecha)
VALUES
(1, 1, '2024-11-01'),
(2, 2, '2024-12-01'),
(3, 3, '2025-01-01');

-- Inserciones en tabla 'reserva_excursion'
INSERT INTO reserva_excursion (id_cliente, id_paquete, id_excursion, fecha, nro_ticket)
VALUES
(1, 1, 1, '2024-11-01',1),
(2, 2, 2, '2024-12-01',2),
(3, 3, 3, '2025-01-01',3);

-- Inserciones en tabla 'estadias'
INSERT INTO estadias (id_paquete, id_hotel, fecha_ini, fecha_fin, precio_x_dia)
VALUES
(1, 1, '2024-11-01', '2024-11-05', 500.00),
(2, 2, '2024-12-01', '2024-12-06', 600.00),
(3, 3, '2025-01-01', '2025-01-07', 700.00);

-- Inserciones en tabla 'reserva_estadias'
INSERT INTO reserva_estadias (id_cliente, id_paquete, id_hotel, fecha_ini, nro_habitacion)
VALUES
(2, 2, 2, '2024-12-01', '101'),
(1, 1, 1, '2024-11-01', '202'),
(3, 3, 3, '2025-01-01', '303');

-- Inserciones en tabla 'comentarios'
INSERT INTO comentarios (fecha, descripcion, estrellas, id_paquete, id_cliente)
VALUES
('2024-11-10', 'Excelente paquete, muy recomendado', 5, 1, 1),
('2024-12-10', 'Buen servicio, aunque mejorable', 4, 2, 2),
('2025-01-10', 'Muy caro para lo que ofrece', 3, 3, 3);

-- Inserciones en tabla 'paquete_transporte'
INSERT INTO paquete_transporte (id_paquete, id_transporte, fecha, descripcion_paradas, precio, categoria_asiento)
VALUES
(1, 1, '2024-11-01', 'Salida desde aeropuerto de Ezeiza', 100.00, 'Económica'),
(2, 2, '2024-12-01', 'Salida desde el aeropuerto de Barajas', 200.00, 'Económica'),
(3, 3, '2025-01-01', 'Salida desde la estación Grand Central', 300.00, 'Primera clase');

-- Inserciones en tabla 'reserva_transporte'
INSERT INTO reserva_transporte (id_cliente, id_paquete, id_transporte, fecha)
VALUES
(1, 1, 1, '2024-11-01'),
(2, 2, 2, '2024-12-01'),
(3, 3, 3, '2025-01-01');