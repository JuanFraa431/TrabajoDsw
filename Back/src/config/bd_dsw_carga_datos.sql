-- Insertar en la tabla transporte
INSERT INTO transporte (descripcion, capacidad, tipo, nombre_empresa, email_empresa)
VALUES 
('Bus turístico', 50, 'Terrestre', 'Turismo Argentino', 'contacto@turismoargentino.com'),
('Avión de lujo', 180, 'Aéreo', 'SkyTravel', 'info@skytravel.com'),
('Crucero de lujo', 2000, 'Marítimo', 'Oceanic Cruises', 'reservas@oceaniccruises.com');

-- Insertar en la tabla ciudad
INSERT INTO ciudad (nombre, descripcion, pais)
VALUES
('Buenos Aires', 'Capital de Argentina, con gran vida cultural', 'Argentina'),
('Río de Janeiro', 'Famosa por sus playas y el Cristo Redentor', 'Brasil'),
('Lima', 'Capital de Perú, conocida por su gastronomía', 'Perú');

-- Insertar en la tabla hotel
INSERT INTO hotel (nombre, direccion, descripcion, telefono, email, estrellas, id_ciudad)
VALUES
('Hotel Plaza', 'Av. Corrientes 1234', 'Hotel de 5 estrellas en el centro de Buenos Aires', '011-5555-1234', 'contacto@hotelplaza.com', 5, 1),
('Copacabana Palace', 'Rua Atlântica 1702', 'Hotel de lujo frente a la playa de Copacabana', '+55-21-2548-7070', 'info@copacabanapalace.com', 5, 2),
('JW Marriott Lima', 'Malecón de la Reserva 615', 'Hotel de lujo con vista al océano', '+51-1-217-7000', 'reservas@marriottlima.com', 5, 3);

-- Insertar en la tabla paquete
INSERT INTO paquete (estado, descripcion, precio)
VALUES
(TRUE, 'Paquete turístico a Buenos Aires por 5 días', 1500.00),
(TRUE, 'Paquete de playa en Río de Janeiro por 7 días', 2000.00),
(FALSE, 'Paquete cultural en Lima por 4 días', 1000.00);

-- Insertar en la tabla cliente
INSERT INTO cliente (nombre, apellido, dni, email, fecha_nacimiento, estado)
VALUES
('Juan', 'Pérez', '12345678', 'juan.perez@mail.com', '1985-05-15', TRUE),
('Maria', 'González', '87654321', 'maria.gonzalez@mail.com', '1990-12-01', TRUE),
('Carlos', 'Martínez', '11223344', 'carlos.martinez@mail.com', '1980-03-22', FALSE);

-- Insertar en la tabla excursion
INSERT INTO excursion (nombre, tipo, descripcion, horario, nro_personas_max, nombre_empresa, mail_empresa, precio, id_ciudad)
VALUES
('Tour por Buenos Aires', 'Cultural', 'Recorrido por los principales puntos turísticos de la ciudad', '09:00:00', 20, 'Turismo Argentino', 'contacto@turismoargentino.com', 50.00, 1),
('Excursión al Cristo Redentor', 'Aventura', 'Subida al Cristo Redentor en Río de Janeiro', '10:30:00', 25, 'RioTravel', 'info@riotour.com', 100.00, 2),
('Tour gastronómico en Lima', 'Cultural', 'Recorrido por los mejores restaurantes de Lima', '19:00:00', 15, 'PeruGourmet', 'info@perugourmet.com', 75.00, 3);

-- Insertar en la tabla reserva_paquete
INSERT INTO reserva_paquete (id_cliente, id_paquete, fecha_reserva, metodo_de_pago, fecha_pago)
VALUES
(1, 1, '2024-08-01', 'Tarjeta de crédito', '2024-08-01'),
(2, 2, '2024-09-15', 'Transferencia bancaria', '2024-09-16'),
(3, 3, '2024-07-10', 'PayPal', '2024-07-11');

-- Insertar en la tabla reserva_excursion
INSERT INTO reserva_excursion (id_cliente, id_paquete, id_excursion, nro_ticket, fecha, fecha_pago)
VALUES
(1, 1, 1, 101, '2024-08-02', '2024-08-01'),
(2, 2, 2, 202, '2024-09-16', '2024-09-15'),
(3, 3, 3, 303, '2024-07-11', '2024-07-10');

-- Insertar en la tabla estadia
INSERT INTO estadia (id_cliente, id_paquete, id_hotel, fecha_ini, fecha_fin, nro_habitacion, precio)
VALUES
(1, 1, 1, '2024-08-01', '2024-08-05', '101', 500.00),
(2, 2, 2, '2024-09-16', '2024-09-23', '202', 700.00),
(3, 3, 3, '2024-07-10', '2024-07-14', '303', 300.00);

-- Insertar en la tabla comentario
INSERT INTO comentario (fecha, descripcion, estrellas, id_paquete, id_cliente)
VALUES
('2024-08-06', 'Excelente experiencia en Buenos Aires', 5, 1, 1),
('2024-09-24', 'Maravillosa playa en Copacabana', 4, 2, 2),
('2024-07-15', 'Increíble comida en Lima', 5, 3, 3);

-- Insertar en la tabla reserva_transporte
INSERT INTO reserva_transporte (id_cliente, id_paquete, id_transporte, fecha, nro_pasaje, descripcion_paradas, precio, categoria_asiento)
VALUES
(1, 1, 1, '2024-08-01', '001-A', 'Paradas en Palermo, Recoleta, y San Telmo', 100.00, 'Económica'),
(2, 2, 2, '2024-09-16', '002-B', 'Vuelo directo desde Río de Janeiro', 300.00, 'Primera Clase'),
(3, 3, 3, '2024-07-10', '003-C', 'Paradas en Lima y Cusco', 200.00, 'Turista');
