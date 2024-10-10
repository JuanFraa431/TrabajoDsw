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
    pais VARCHAR(100) NOT NULL
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
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_ini DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

-- Tabla clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    estado BOOLEAN NOT NULL
);

-- Tabla excursiones
CREATE TABLE excursiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    horario TIME NOT NULL,
    nro_personas_max INT NOT NULL,
    nombre_empresa VARCHAR(255) NOT NULL,
    mail_empresa VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    id_ciudad INT NOT NULL,
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
    FOREIGN KEY (id_paquete, id_excursion, fecha) 
        REFERENCES paquete_excursion(id_paquete, id_excursion, fecha)
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
    FOREIGN KEY (id_paquete, id_transporte, fecha) 
        REFERENCES paquete_transporte(id_paquete, id_transporte, fecha)
);