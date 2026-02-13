# Propuesta TP DSW

## Grupo

### Integrantes

- 51331 - Alaniz, Juan Francisco
- 51564 - Cascardo, Bruno
- 50489 - Dragotta, Tomás
- 51200 - Martinez, Jano

## Tema

### Descripción

_El sistema de gestión para la agencia de turismo automatiza procesos de alta, baja, modificación y consulta de destinos, excursiones y clientes. Permite la creación flexible de paquetes de viaje e integra un módulo de reservas en línea. Incluye herramientas para seguimiento de consultas y quejas, garantizando una gestión eficiente y transparente._

### Modelo

![Modelo de Clases](<(https://github.com/JuanFraa431/TrabajoDsw/blob/main/MD%20dsw.drawio.png)>)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Paquete<br>2. CRUD Cliente<br>3. CRUD Ciudad<br>4.CRUD Transporte|
|CRUD dependiente|1. CRUD Hotel {depende de} CRUD Ciudad<br>2. CRUD Excursión {depende de} CRUD Ciudad|
|Listado<br>+<br>detalle| 1. Listado de paquetes filtrado por ciudad, muestra nro, excursiones y transporte => detalle CRUD Paquete<br> 2. Listado de paquetes filtrado por rango de fecha, muestra nro, excursiones, transporte y ciudad => detalle muestra datos completos del paquete y
|CUU/Epic|1. Reservar un paquete<br>2. Realizar la creación de un paquete|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |CRUD Usuario<br>CRUD Reserva de Paquete<br>CRUD Pago<br>CRUD Comentario<br>CRUD Cancelación<br>CRUD Tipo de Transporte<br>CRUD PaqueteExcursión<br>CRUD PaqueteTransporte<br>CRUD Estadía|
|CUU/Epic|Aprobar/Rechazar pago y reserva del paquete<br>Realizar un comentario en un paquete y permitir borrado por el usuario o por un admin|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                             |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Listados | Listado de hoteles<br>Listado de excursiones                                                                                                                                                                        |
| CUU/Epic | Consultar estadísticas de Destinos más populares (admin)<br>Consultar estadísticas de Reservas por período (admin)<br>Consultar estadísticas de Ingresos y facturación (admin)<br>Cancelar la reserva de un paquete |
| Otros    | Inicio de sesión con cuenta de Google<br>Subir imágenes automáticamente a la nube<br>Envío de mails para confirmar solicitud y confirmar/rechazar reserva                                                           |

## Página pública

https://odysseytravels.infinityfreeapp.com/

## Ejecutar el proyecto localmente

`npm run startAll`