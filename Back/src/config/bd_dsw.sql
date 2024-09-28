DROP DATABASE IF EXISTS agenciadeviajes;

-- Crear la base de datos
CREATE DATABASE agenciadeviajes;
USE agenciadeviajes;

-- Tabla transporte
CREATE TABLE transporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    capacidad INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    nombre_empresa VARCHAR(255) NOT NULL,
    email_empresa VARCHAR(255) NOT NULL
);

-- Tabla ciudad
CREATE TABLE ciudad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    pais VARCHAR(100) NOT NULL
);

-- Tabla hotel
CREATE TABLE hotel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    estrellas INT NOT NULL,
    id_ciudad INT NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id)
);

-- Tabla paquete
CREATE TABLE paquete (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado BOOLEAN NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DOUBLE NOT NULL
);

-- Tabla cliente
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estado BOOLEAN NOT NULL
);

-- Tabla excursion
CREATE TABLE excursion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    horario TIME NOT NULL,
    nro_personas_max INT NOT NULL,
    nombre_empresa VARCHAR(255) NOT NULL,
    mail_empresa VARCHAR(255) NOT NULL,
    precio DOUBLE NOT NULL,
    id_ciudad INT NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id)
);

-- Tabla reserva_paquete
CREATE TABLE reserva_paquete (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    metodo_de_pago VARCHAR(100) NOT NULL,
    fecha_pago DATE NOT NULL,
    PRIMARY KEY (id_cliente, id_paquete, fecha_reserva),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_paquete) REFERENCES paquete(id)
);

-- Tabla reserva_excursion
CREATE TABLE reserva_excursion (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_excursion INT NOT NULL,
    nro_ticket INT NOT NULL,
    fecha DATE NOT NULL,
    fecha_pago DATE NOT NULL,
    PRIMARY KEY (id_cliente, id_excursion, fecha),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_paquete) REFERENCES paquete(id),
    FOREIGN KEY (id_excursion) REFERENCES excursion(id)
);

-- Tabla estadia
CREATE TABLE estadia (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_hotel INT NOT NULL,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    nro_habitacion VARCHAR(50) NOT NULL,
    precio DOUBLE NOT NULL,
    PRIMARY KEY (id_cliente, id_hotel, fecha_ini),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_paquete) REFERENCES paquete(id),
    FOREIGN KEY (id_hotel) REFERENCES hotel(id)
);

-- Tabla comentario
CREATE TABLE comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estrellas INT NOT NULL,
    id_paquete INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_paquete) REFERENCES paquete(id)
);

-- Tabla reserva_transporte
CREATE TABLE reserva_transporte (
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_transporte INT NOT NULL,
    fecha DATE NOT NULL,
    nro_pasaje VARCHAR(50) NOT NULL,
    descripcion_paradas VARCHAR(255) NOT NULL,
    precio FLOAT NOT NULL,
    categoria_asiento VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_cliente, id_transporte, fecha),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_paquete) REFERENCES paquete(id),
    FOREIGN KEY (id_transporte) REFERENCES transporte(id)
);
