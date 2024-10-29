CREATE USER IF NOT EXISTS 'dsw' @'%' IDENTIFIED BY 'dsw';
GRANT ALL PRIVILEGES ON agenciadeviajes.* TO 'dsw' @'%';
FLUSH PRIVILEGES;

DROP DATABASE IF EXISTS agenciadeviajes;
-- Crear la base de datos
CREATE DATABASE agenciadeviajes;
USE agenciadeviajes;
-- Tabla transportes
CREATE TABLE transportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    capacidad INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    nombre_empresa VARCHAR(255) NOT NULL,
    mail_empresa VARCHAR(255) NOT NULL
);
-- Tabla ciudades
CREATE TABLE ciudades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    latitud VARCHAR(250) NOT NULL,
    longitud VARCHAR(250) NOT NULL
);
-- Tabla hoteles
CREATE TABLE hoteles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    estrellas INT NOT NULL,
    id_ciudad INT NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id)
);
-- Tabla paquetes
CREATE TABLE paquetes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado BOOLEAN NOT NULL,
    descripcion TEXT NOT NULL,
    detalle VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    imagen VARCHAR(255) NOT NULL
);
-- Tabla clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estado BOOLEAN NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    imagen VARCHAR(1000),
    unique(username)
);
-- Tabla excursiones
CREATE TABLE excursiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    detalle VARCHAR(255),
    horario TIME NOT NULL,
    nro_personas_max INT NOT NULL,
    nombre_empresa VARCHAR(255) NOT NULL,
    mail_empresa VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    id_ciudad INT NOT NULL,
    imagen VARCHAR(255),
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id)
);
-- Tabla paquete_excursion
CREATE TABLE paquete_excursion (
    id_paquete INT NOT NULL,
    id_excursion INT NOT NULL,
    fecha DATE NOT NULL,
    PRIMARY KEY (id_excursion, id_paquete, fecha),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id),
    FOREIGN KEY (id_excursion) REFERENCES excursiones(id)
);
-- Tabla reserva_paquete
CREATE TABLE reserva_excursion (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_excursion INT NOT NULL,
    fecha DATE NOT NULL,
    nro_ticket INT NOT NULL,
    PRIMARY KEY (id_cliente, id_excursion, fecha),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_paquete, id_excursion, fecha) REFERENCES paquete_excursion(id_paquete, id_excursion, fecha)
);
-- Tabla estadias
CREATE TABLE estadias (
    id INT AUTO_INCREMENT,
    id_paquete INT NOT NULL,
    id_hotel INT NOT NULL,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_x_dia DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id),
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id)
);
-- Tabla reserva_estadias
CREATE TABLE reserva_estadias (
    id_cliente INT NOT NULL,
    id_estadia INT NOT NULL,
    nro_habitacion VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_estadia, id_cliente),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_estadia) REFERENCES estadias(id)
);
-- Tabla comentarios
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estrellas INT NOT NULL,
    id_paquete INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id)
);
-- Tabla paquete_transporte
CREATE TABLE paquete_transporte (
    id_paquete INT NOT NULL,
    id_transporte INT NOT NULL,
    fecha DATE NOT NULL,
    descripcion_paradas VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria_asiento VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_transporte, id_paquete, fecha),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id),
    FOREIGN KEY (id_transporte) REFERENCES transportes(id)
);
-- Tabla reserva_transporte
CREATE TABLE reserva_transporte (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_transporte INT NOT NULL,
    fecha DATE NOT NULL,
    PRIMARY KEY (id_cliente, id_transporte, id_paquete),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_paquete, id_transporte, fecha) REFERENCES paquete_transporte(id_paquete, id_transporte, fecha)
);
-- Inserciones en tabla 'ciudades'
INSERT INTO ciudades (nombre, descripcion, pais, latitud, longitud)
VALUES (
        'Buenos Aires',
        'Capital de Argentina',
        'Argentina',
        '-34.6037',
        '-58.3816'
    ),
    (
        'Madrid',
        'Capital de España',
        'España',
        '40.4168',
        '-3.7038'
    ),
    (
        'Nueva York',
        'Ciudad en Estados Unidos',
        'Estados Unidos',
        '40.7128',
        '-74.0060'
    ),
    (
        'Rio de Janeiro',
        'Famosa por sus playas y el Cristo Redentor',
        'Brasil',
        '-22.9068',
        '-43.1729'
    ),
    (
        'Lima',
        'Capital gastronómica de Sudamérica',
        'Perú',
        '-12.0464',
        '-77.0428'
    ),
    (
        'Cancún',
        'Conocido por sus playas de arena blanca',
        'México',
        '21.1619',
        '-86.8515'
    ),
    (
        'Barcelona',
        'Conocida por su arquitectura y cultura',
        'España',
        '41.3851',
        '2.1734'
    ),
    (
        'Santiago',
        'Capital de Chile, rodeada de montañas',
        'Chile',
        '-33.4489',
        '-70.6693'
    );
-- Inserciones en tabla 'transportes'
/*
INSERT INTO transportes (
        descripcion,
        capacidad,
        tipo,
        nombre_empresa,
        mail_empresa
    )
VALUES (
        'Autobús de turismo',
        50,
        'Autobús',
        'Turismo SRL',
        'contacto@turismosrl.com'
    ),
    (
        'Avión comercial',
        180,
        'Avión',
        'Aerolíneas Argentinas',
        'info@aerolineas.com.ar'
    ),
    (
        'Tren de alta velocidad',
        300,
        'Tren',
        'Renfe',
        'contacto@renfe.com'
    ),
    (
        'Autobús turístico',
        50,
        'Terrestre',
        'Transporte Río',
        'contacto@transporterio.com'
    ),
    (
        'Minibús privado',
        12,
        'Terrestre',
        'Viajes Lima',
        'info@viajeslima.com'
    ),
    (
        'Ferry a Isla Mujeres',
        150,
        'Marítimo',
        'Ferries del Caribe',
        'reservas@ferriescaribe.com'
    ),
    (
        'Transfer aeropuerto',
        8,
        'Terrestre',
        'Transfers Barcelona',
        'info@transfersbarcelona.com'
    ),
    (
        'Bus de lujo',
        45,
        'Terrestre',
        'Transportes Santiago',
        'reservas@transportessantiago.com'
    );
*/
-- Inserciones en tabla 'hoteles'
INSERT INTO hoteles (
        nombre,
        direccion,
        descripcion,
        telefono,
        email,
        estrellas,
        id_ciudad
    )
VALUES (
        'Hotel Hilton',
        'Av. Santa Fe 123',
        'Hotel 5 estrellas de lujo',
        '123456789',
        'hilton@hoteles.com',
        5,
        1
    ),
    (
        'NH Collection',
        'Calle de Alcalá 345',
        'Hotel céntrico en Madrid',
        '987654321',
        'nh@hoteles.com',
        4,
        2
    ),
    (
        'The Plaza',
        '5th Avenue 768',
        'Hotel de lujo en Nueva York',
        '1122334455',
        'plaza@hoteles.com',
        5,
        3
    ),
    (
        'Hotel Copacabana',
        'Av. Atlântica, 1702 - Copacabana',
        'Hotel frente a la playa con piscina',
        '21 1234-5678',
        'info@copacabana.com',
        4,
        4
    ),
    (
        'Hotel Miraflores',
        'Av. José Larco 812',
        'Hotel elegante en el corazón de Miraflores',
        '51 1 234-5678',
        'contacto@miraflores.com',
        5,
        5
    ),
    (
        'Hotel Playa del Carmen',
        '5a Avenida, 123',
        'Resort con todo incluido cerca de la playa',
        '52 987 654 3210',
        'reservas@playadelcarmen.com',
        4,
        6
    ),
    (
        'Hotel Barcelona Center',
        'Carrer de Pau Claris, 1',
        'Hotel boutique en el centro de Barcelona',
        '+34 93 123 4567',
        'info@barcelonacenter.com',
        4,
        7
    ),
    (
        'Hotel Santiago Plaza',
        'Av. Apoquindo 6580',
        'Hotel moderno en el distrito financiero',
        '56 2 2345 6789',
        'reservas@santiagoplaza.com',
        4,
        8
    );
-- Inserciones en tabla 'paquetes'
INSERT INTO paquetes (
        estado,
        detalle,
        descripcion,
        precio,
        fecha_ini,
        fecha_fin,
        imagen
    )
VALUES (
        true,
        'Paquete turístico a Buenos Aires',
        'Disfruta de un paquete completo que incluye alojamiento en un hotel de tres estrellas ubicado en el centro de Buenos Aires. Comienza tus días con un delicioso desayuno buffet. Durante tu estancia, explorarás los principales atractivos turísticos como la Plaza de Mayo, el barrio de San Telmo, y la famosa calle Caminito en La Boca. Además, tendrás la oportunidad de asistir a un espectáculo de tango en vivo, sumergiéndote en la cultura local.',
        1200.50,
        '2024-11-01',
        '2024-11-05',
        "https://www.tangol.com/Fotos/Destinos/buenos-aires_201608180851170.Mobile.webp"
    ),
    (
        true,
        'Paquete turístico a Madrid',
        'Este paquete te ofrece una experiencia única en Madrid, donde podrás disfrutar de 5 noches en un hotel céntrico con desayuno incluido. Tendrás acceso a un tour guiado por el Palacio Real, la Puerta del Sol, y el Parque del Retiro. También incluimos entradas a los museos más importantes, como el Museo del Prado y el Reina Sofía, para que puedas admirar obras maestras de artistas como Goya y Picasso. Al finalizar el día, relájate en una de las muchas terrazas con vistas a la ciudad.',
        1500.75,
        '2024-12-01',
        '2024-12-06',
        "https://blog.localadventures.mx/wp-content/uploads/2022/10/Madrid-Plaza-Mayor.jpg"
    ),
    (
        false,
        'Paquete de lujo a Nueva York',
        'Este exclusivo paquete incluye 7 noches de alojamiento en un hotel de lujo en el corazón de Manhattan, con todas las comodidades. Disfruta de un acceso VIP a las atracciones más populares de la ciudad, como el Empire State Building, Central Park y un recorrido en barco por la Estatua de la Libertad. También tendrás la oportunidad de asistir a un espectáculo de Broadway. Además, se incluye un servicio de conserjería personal que te ayudará a planificar tu itinerario para que aproveches al máximo tu visita a la Gran Manzana.',
        3000.00,
        '2025-01-01',
        '2025-01-07',
        "https://americanreceptive.es/wp-content/uploads/2018/07/1-74.jpg"
    ),
    (
        true,
        'Paquete a Río de Janeiro con hotel y excursión',
        'Este paquete ofrece una experiencia inolvidable en Río de Janeiro, con 8 noches de alojamiento en un hotel frente a la playa de Copacabana. El paquete incluye un desayuno diario y un tour guiado a las principales atracciones como el Cristo Redentor y el Pan de Azúcar. Además, podrás disfrutar de un día de excursión a las impresionantes playas de Búzios. También incluimos una cena típica brasileña en una churrasquería local, donde podrás disfrutar de los mejores cortes de carne.',
        1200.00,
        '2025-01-06',
        '2025-01-14',
        "https://media.staticontent.com/media/pictures/c2dc2d0b-f4a3-451f-a734-8dafc1b42477/300x200"
    ),
    (
        true,
        'Escapada a Lima con clases de cocina',
        'Vive una experiencia única en Lima, donde pasarás 7 noches en un hotel boutique con desayuno incluido. Este paquete incluye una clase de cocina peruana donde aprenderás a preparar platos típicos como el ceviche y el lomo saltado. Además, disfrutarás de un tour por el centro histórico de Lima, visitando lugares emblemáticos como la Plaza Mayor y la Catedral de Lima. Para completar tu experiencia, tendrás una cena en un restaurante de renombre, degustando la exquisita gastronomía local.',
        850.00,
        '2025-01-06',
        '2025-01-14',
        "https://media.staticontent.com/media/pictures/18426b70-15dd-43da-a889-b9a8e0479881/300x300"
    ),
    (
        true,
        'Vacaciones en Cancún con snorkel y hotel',
        'Disfruta de unas vacaciones soñadas en Cancún con este paquete que incluye 7 noches de alojamiento en un resort todo incluido. Este paquete te permitirá explorar los impresionantes arrecifes de coral de la Riviera Maya con un tour de snorkel. También disfrutarás de actividades acuáticas como kayak y paddleboarding. Cada día, podrás degustar una variedad de comidas en los múltiples restaurantes del resort y relajarte en la playa con un cóctel en la mano.',
        1400.00,
        '2025-01-06',
        '2025-01-14',
        "https://www.argtravelagency.com.ar/wp-content/uploads/2017/10/joanna-szumska-yZhQkOGJk_o-unsplash.jpg"
    ),
    (
        true,
        'Tour cultural en Barcelona',
        'Embárcate en un tour cultural de 8 días en Barcelona. Este paquete incluye alojamiento en un hotel de cuatro estrellas con desayuno incluido. Explora la Sagrada Familia, el Parque Güell y el barrio gótico con un guía experto. Tendrás la oportunidad de participar en una clase de flamenco y disfrutar de una cena tradicional española. Además, se incluye un día libre para que explores la ciudad a tu ritmo, visitando tiendas, museos y cafeterías locales.',
        1100.00,
        '2025-01-06',
        '2025-01-14',
        "https://travelviajes.net/image/casa-mila-casa-batllo-barcelona-917.jpg"
    ),
    (
        true,
        'Viaje a Santiago con tour a Valparaíso',
        'Descubre la vibrante cultura de Santiago y Valparaíso con este paquete de 8 días. Incluye alojamiento en un hotel céntrico y un tour guiado a los puntos más emblemáticos de Santiago, como el Cerro San Cristóbal y el Mercado Central. Además, disfrutarás de un día completo en Valparaíso, conocido por su arte callejero y arquitectura colorida. Al finalizar el viaje, disfrutarás de una cena de despedida en un restaurante local, degustando la gastronomía chilena.',
        950.00,
        '2025-01-06',
        '2025-01-14',
        "https://www.hotelinfo.com.ar/uploads/6614492b47650.jpg"
    );


-- Inserciones en tabla 'clientes'
INSERT INTO clientes (
        nombre,
        apellido,
        dni,
        email,
        fecha_nacimiento,
        estado,
        username,
        password,
        tipo_usuario,
        imagen
    )
VALUES (
        'Juan',
        'Pérez',
        '12345678',
        'juan.perez@mail.com',
        '1980-05-15',
        true,
        'juanperez',
        '123456',
        'cliente',
        'https://www.cajabambaperu.com/wp-content/uploads/2018/06/juan-perez.jpg'
    ),
    (
        'María',
        'Gómez',
        '87654321',
        'maria.gomez@mail.com',
        '1990-03-10',
        true,
        'mariagomez',
        '123456',
        'cliente',
        ''
    ),
    (
        'Pedro',
        'Fernández',
        '45678912',
        'pedro.fernandez@mail.com',
        '1985-07-20',
        false,
        'pedrofernandez',
        '123456',
        'cliente',
        ''
    ), (
        'Admin',
        '',
        '1',
        'admin@admin',
        '1980-05-15',
        true,
        'admin',
        '$2b$10$WUe5775fiXJbqywxe7C1LOCTZNo9jhyQTxms06Mb5woYwTzWDTd2e',
        'admin',
        'https://cdn.discordapp.com/attachments/1041463155680874618/1296256493083037766/imagen_admin.jpg?ex=6711a06f&is=67104eef&hm=75a60090424a5bcc0fbf4169a4aa6f1e93015f13b2a1c64d63e9b35d59c7c6bd&'
    );
-- Inserciones en tabla 'excursiones'
INSERT INTO excursiones (
    nombre,
    tipo,
    descripcion,
    detalle,
    horario,
    nro_personas_max,
    nombre_empresa,
    mail_empresa,
    precio,
    id_ciudad,
    imagen
)
VALUES 
    (
        'City Tour Buenos Aires',
        'Cultural',
        'Explora Buenos Aires a través de un recorrido guiado que abarca los lugares más emblemáticos de la ciudad, como el Obelisco, el barrio de San Telmo y la moderna Puerto Madero. Sumérgete en la historia y cultura de la capital argentina con explicaciones detalladas y paradas en puntos icónicos.',
        'Tour por los lugares emblemáticos de Buenos Aires.',
        '10:00:00',
        30,
        'Turismo BA',
        'info@turismoba.com',
        50.00,
        1,
        'https://turismo.buenosaires.gob.ar/sites/turismo/files/field/image/buses_bus-turistico-1500x610.jpg'
    ),
    (
        'Tour por el Prado',
        'Museo',
        'Descubre las maravillas del Museo del Prado en Madrid con una visita guiada que explora obras maestras de artistas como Goya y Velázquez. Esta excursión ofrece una experiencia enriquecedora en arte e historia española, ideal para amantes de la cultura y el patrimonio europeo.',
        'Visita guiada por el famoso Museo del Prado.',
        '11:00:00',
        25,
        'Cultura Madrid',
        'info@culturamadrid.com',
        45.00,
        2,
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/64/f0/28/museo-nacional-del-prado.jpg'
    ),
    (
        'Tour Estatua de la Libertad',
        'Monumento',
        'Navega hacia la icónica Estatua de la Libertad en Nueva York con este tour en barco que incluye paradas en Ellis Island. Aprende sobre su historia y simbolismo, y disfruta de vistas panorámicas de Manhattan. Una experiencia perfecta para aquellos interesados en el simbolismo de la libertad y la inmigración.',
        'Excursión en barco a la Estatua de la Libertad.',
        '09:00:00',
        50,
        'NYC Tours',
        'info@nyctours.com',
        70.00,
        3,
        'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/eb/6b/72.jpg'
    ),
    (
        'Tour por el Cristo Redentor',
        'Cultural',
        'Vive una experiencia inolvidable en el Cristo Redentor de Río de Janeiro. Con guía especializado, explora la historia y cultura detrás de este monumento, una de las Nuevas Siete Maravillas del Mundo, mientras disfrutas de vistas espectaculares de la ciudad desde lo alto del Corcovado.',
        'Visita guiada al Cristo Redentor en Río.',
        '09:00:00',
        30,
        'Excursiones Río',
        'info@excursionesrio.com',
        50.00,
        1,
        'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/06/6f/5f/fa.jpg'
    ),
    (
        'Clase de cocina peruana',
        'Gastronomía',
        'Adéntrate en los sabores únicos de la cocina peruana con esta clase interactiva donde aprenderás a preparar platos icónicos como el ceviche y la causa limeña. Guiado por un chef local, esta actividad ofrece una inmersión cultural a través de los ingredientes y técnicas culinarias tradicionales.',
        'Clase interactiva de cocina tradicional peruana.',
        '14:00:00',
        10,
        'Cocina Lima',
        'reservas@cocinalima.com',
        70.00,
        2,
        'https://portal.andina.pe/EDPfotografia3/Thumbnail/2016/09/10/000375451W.jpg'
    ),
    (
        'Snorkel en Isla Mujeres',
        'Aventura',
        'Disfruta de una experiencia de snorkel única en las aguas cristalinas del Caribe en Isla Mujeres. Descubre coloridos arrecifes de coral, peces tropicales y otras especies marinas, ideal para amantes de la aventura y la naturaleza. Actividad segura y divertida, perfecta para explorar la vida marina.',
        'Snorkel en arrecifes del Caribe.',
        '10:00:00',
        25,
        'Aventuras del Caribe',
        'info@aventurascaribe.com',
        60.00,
        3,
        'https://i0.wp.com/chetumaltours.com/wp-content/uploads/2021/10/tours-snorkeling-isla-mujeres-pamela-2.jpg'
    ),
    (
        'Visita a La Sagrada Familia',
        'Cultural',
        'Sumérgete en la arquitectura de Antoni Gaudí con una visita guiada por la Sagrada Familia en Barcelona. Aprende sobre el diseño y simbolismo de esta impresionante basílica en constante evolución, una obra maestra que combina elementos góticos y art nouveau en un espacio único.',
        'Tour por la basílica de la Sagrada Familia.',
        '11:00:00',
        20,
        'Excursiones Barcelona',
        'info@excursionesbarcelona.com',
        40.00,
        4,
        'https://amigotours.com/wp-content/uploads/sites/4285/2023/10/sagrada-familia-ticket.jpg'
    ),
    (
        'Tour por Valparaíso',
        'Cultural',
        'Descubre los encantos de Valparaíso, Chile, en un recorrido por sus famosos cerros y coloridas calles. Explora los murales, disfruta de vistas al Pacífico y aprende sobre su vibrante historia y cultura bohemia en un tour que destaca la esencia artística de esta ciudad costera.',
        'Tour por los cerros y murales de Valparaíso.',
        '09:00:00',
        15,
        'Tours Santiago',
        'contacto@tourssantiago.com',
        45.00,
        5,
        'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6f/45/eb.jpg'
    );


-- Inserciones en tabla 'paquete_excursion'
/*
INSERT INTO paquete_excursion (id_paquete, id_excursion, fecha)
VALUES (1, 1, '2024-11-01'),
    (2, 2, '2024-12-01'),
    (3, 3, '2025-01-01'),
    (4, 4, '2025-01-06'),
    (5, 5, '2025-01-06'),
    (6, 6, '2025-01-06'),
    (7, 7, '2025-01-06'),
    (8, 8, '2025-01-06');

-- Inserciones en tabla 'reserva_excursion'
INSERT INTO reserva_excursion (
        id_cliente,
        id_paquete,
        id_excursion,
        fecha,
        nro_ticket
    )
VALUES (1, 1, 1, '2024-11-01', 1),
    (2, 2, 2, '2024-12-01', 2),
    (3, 3, 3, '2025-01-01', 3);
*/
-- Inserciones en tabla 'estadias'
INSERT INTO estadias (
        id_paquete,
        id_hotel,
        fecha_ini,
        fecha_fin,
        precio_x_dia
    )
VALUES (1, 1, '2024-11-01', '2024-11-05', 500.00),
    (2, 2, '2024-12-01', '2024-12-06', 600.00),
    (3, 3, '2025-01-01', '2025-01-07', 700.00),
    (4, 4, '2025-01-06', '2025-01-14', 100.00),
    (5, 5, '2025-01-06', '2025-01-14', 150.00),
    (6, 6, '2025-01-06', '2025-01-14', 200.00),
    (7, 7, '2025-01-06', '2025-01-14', 250.00),
    (8, 8, '2025-01-06', '2025-01-14', 300.00);
/*
-- Inserciones en tabla 'reserva_estadias'
INSERT INTO reserva_estadias (id_cliente, id_estadia, nro_habitacion)
VALUES (2, 2, '101'),
    (1, 1, '202'),
    (3, 3, '303'),
    (1, 4, '404'),
    (2, 5, '505'),
    (3, 6, '606'),
    (1, 7, '707'),
    (2, 8, '808');
*/
-- Inserciones en tabla 'comentarios'
INSERT INTO comentarios (
        fecha,
        descripcion,
        estrellas,
        id_paquete,
        id_cliente
    )
VALUES (
        '2024-11-10',
        'Excelente paquete, muy recomendado',
        5,
        1,
        1
    ),
    (
        '2024-12-10',
        'Buen servicio, aunque mejorable',
        4,
        2,
        2
    ),
    (
        '2025-01-10',
        'Muy caro para lo que ofrece',
        3,
        3,
        3
    ),
    (
        '2025-01-09',
        'Excelente paquete, muy bien organizado.',
        5,
        1,
        1
    ),
    (
        '2025-01-10',
        'La comida fue increíble en Lima.',
        4,
        2,
        2
    ),
    (
        '2025-01-11',
        'Las playas de Cancún son un sueño.',
        5,
        3,
        3
    ),
    (
        '2025-01-12',
        'Barcelona es hermosa, una experiencia inolvidable.',
        5,
        4,
        3
    );
/*
-- Inserciones en tabla 'paquete_transporte'
INSERT INTO paquete_transporte (
        id_paquete,
        id_transporte,
        fecha,
        descripcion_paradas,
        precio,
        categoria_asiento
    )
VALUES (
        1,
        1,
        '2024-11-01',
        'Salida desde aeropuerto de Ezeiza',
        100.00,
        'Económica'
    ),
    (
        2,
        2,
        '2024-12-01',
        'Salida desde el aeropuerto de Barajas',
        200.00,
        'Económica'
    ),
    (
        3,
        3,
        '2025-01-01',
        'Salida desde la estación Grand Central',
        300.00,
        'Primera clase'
    ),
    (
        1,
        1,
        '2025-01-06',
        'Paradas en puntos turísticos',
        30.00,
        'Económico'
    ),
    (
        2,
        2,
        '2025-01-06',
        'Recogida en el aeropuerto',
        20.00,
        'Económico'
    ),
    (
        3,
        3,
        '2025-01-06',
        'Transfer a Isla Mujeres',
        40.00,
        'Económico'
    ),
    (
        4,
        4,
        '2025-01-06',
        'Transfer desde el aeropuerto',
        25.00,
        'Económico'
    ),
    (
        5,
        5,
        '2025-01-06',
        'Transfer desde el hotel',
        15.00,
        'Económico'
    );
-- Inserciones en tabla 'reserva_transporte'
INSERT INTO reserva_transporte (id_cliente, id_paquete, id_transporte, fecha)
VALUES (1, 1, 1, '2024-11-01'),
    (2, 2, 2, '2024-12-01'),
    (3, 3, 3, '2025-01-01');
*/