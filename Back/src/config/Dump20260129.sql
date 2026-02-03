-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: jartraining
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `consulta`
--

DROP TABLE IF EXISTS `consulta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consulta` (
  `id_cliente` int NOT NULL,
  `id_profesional` int NOT NULL,
  `fecha_consulta` date NOT NULL,
  `desc_resultados` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`,`id_profesional`,`fecha_consulta`),
  KEY `id_profesional` (`id_profesional`),
  CONSTRAINT `consulta_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `consulta_ibfk_2` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consulta`
--

LOCK TABLES `consulta` WRITE;
/*!40000 ALTER TABLE `consulta` DISABLE KEYS */;
INSERT INTO `consulta` VALUES (12,2,'2025-12-05','Se ajusta objetivo: recomposición, aumenta proteína.'),(13,3,'2025-12-06','Plan déficit leve, mejora hidratación.'),(14,4,'2025-12-07','Enfoque fuerza base y técnica.'),(15,5,'2025-12-08','Ajuste calorías, más fibra.'),(16,6,'2025-12-09','Revisión de sueño y timing de comidas.'),(17,7,'2025-12-10','Rutina 4 días, progresión lineal.'),(18,8,'2025-12-11','Meal prep: arroz + pollo + verduras.'),(19,9,'2025-12-12','Ajuste de grasas y micronutrientes.'),(20,10,'2025-12-13','Objetivo rendimiento: sube carbo.'),(21,11,'2025-12-14','Control de ansiedad, colaciones.'),(22,2,'2025-12-15','Plan inicial y mediciones.'),(23,3,'2025-12-16','Se pauta rutina y seguimiento.'),(24,4,'2025-12-17','Corrección técnica en básicos.'),(25,5,'2025-12-18','Sube ingesta de calcio y vitamina D.'),(26,6,'2025-12-19','Rutina hipertrofia, volumen moderado.'),(27,7,'2025-12-20','Se suma movilidad y core.'),(28,8,'2025-12-21','Ajuste macros para cocina laboral.'),(29,9,'2025-12-22','Manejo de estrés, pasos diarios.'),(30,10,'2025-12-23','Plan de fuerza 5x5.'),(31,11,'2025-12-24','Déficit controlado, adherencia.'),(32,2,'2025-12-25','Revisión de progreso y medidas.'),(33,3,'2025-12-26','Plan alto en proteína, snack saludable.'),(34,4,'2025-12-27','Se trabaja potencia y salto.'),(35,5,'2025-12-28','Ajuste de carbo por entrenamiento.'),(36,6,'2025-12-29','Plan de running base, progresivo.'),(37,7,'2025-12-30','Se pauta recuperación activa.'),(38,8,'2025-12-31','Mejora postura y espalda.'),(39,9,'2026-01-02','Rutina upper/lower, progresión.'),(40,10,'2026-01-03','Plan ganancia muscular, más calorías.'),(41,11,'2026-01-04','Control general y plan mensual.');
/*!40000 ALTER TABLE `consulta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicio`
--

DROP TABLE IF EXISTS `ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `zona` varchar(50) DEFAULT NULL,
  `tipo_ejercicio` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicio`
--

LOCK TABLES `ejercicio` WRITE;
/*!40000 ALTER TABLE `ejercicio` DISABLE KEYS */;
INSERT INTO `ejercicio` VALUES (1,'Sentadilla','Básico pierna','Piernas','Barra'),(2,'Peso muerto','Cadena posterior',NULL,NULL),(3,'Press banca','Pecho',NULL,NULL),(4,'Press militar','Hombros',NULL,NULL),(5,'Dominadas','Espalda',NULL,NULL),(6,'Remo con barra','Espalda',NULL,NULL),(7,'Zancadas','Piernas',NULL,NULL),(8,'Prensa','Piernas',NULL,NULL),(9,'Curl bíceps','Bíceps',NULL,NULL),(10,'Fondos','Tríceps/pecho',NULL,NULL),(11,'Plancha','Core',NULL,NULL),(12,'Crunch','Abdominales',NULL,NULL),(13,'Elevación lateral','Deltoides medio',NULL,NULL),(14,'Extensión tríceps','Tríceps',NULL,NULL),(15,'Curl femoral','Isquios',NULL,NULL),(16,'Extensión cuádriceps','Cuádriceps',NULL,NULL),(17,'Hip thrust','Glúteos',NULL,NULL),(18,'Gemelos','Pantorrillas',NULL,NULL),(19,'Burpees','Cardio/Full body',NULL,NULL),(20,'Saltos al cajón','Potencia',NULL,NULL),(21,'Mountain climbers','Core/cardio',NULL,NULL),(22,'Remo en polea','Espalda',NULL,NULL),(23,'Press inclinado','Pecho superior',NULL,NULL),(24,'Face pull','Deltoides posterior',NULL,NULL),(25,'Ab wheel','Core avanzado',NULL,NULL),(26,'Trote','Cardio base',NULL,NULL),(27,'Sprints','Velocidad',NULL,NULL),(28,'Bicicleta fija','Cardio',NULL,NULL),(29,'Elíptico','Cardio bajo impacto',NULL,NULL),(30,'Estiramientos','Movilidad/recuperación',NULL,NULL),(31,'Press de Banca','Ejercicio compuesto para pecho con barra en banco plano','Pecho','Barra'),(32,'Aperturas con Mancuernas','Ejercicio de aislamiento para pecho en banco inclinado','Pecho','Mancuerna'),(33,'Fondos en Paralelas','Ejercicio compuesto para pecho y tríceps usando peso corporal','Pecho','Peso Corporal'),(34,'Dominadas','Ejercicio compuesto para espalda, jalón vertical con peso corporal','Espalda','Peso Corporal'),(35,'Remo con Barra','Ejercicio compuesto para espalda dorsal con barra','Espalda','Barra'),(36,'Jalón al Pecho','Ejercicio para dorsales usando polea alta','Espalda','Polea'),(37,'Peso Muerto','Ejercicio compuesto para espalda baja, glúteos y piernas','Full Body','Barra'),(38,'Press Militar','Ejercicio compuesto para hombros con barra','Hombros','Barra'),(39,'Elevaciones Laterales','Ejercicio de aislamiento para hombro medio con mancuernas','Hombros','Mancuerna'),(40,'Face Pull','Ejercicio para hombro posterior y trapecio con polea','Hombros','Polea'),(41,'Curl de Bíceps con Barra','Ejercicio de aislamiento para bíceps con barra','Bíceps','Barra'),(42,'Curl Martillo','Ejercicio para bíceps y antebrazo con mancuernas','Bíceps','Mancuerna'),(43,'Curl en Polea','Ejercicio de aislamiento para bíceps con tensión constante','Bíceps','Polea'),(44,'Press Francés','Ejercicio de aislamiento para tríceps con barra','Tríceps','Barra'),(45,'Extensiones con Mancuerna','Ejercicio para tríceps con mancuerna por encima de la cabeza','Tríceps','Mancuerna'),(46,'Jalón de Tríceps','Ejercicio de aislamiento para tríceps en polea alta','Tríceps','Polea'),(47,'Sentadilla con Barra','Ejercicio compuesto fundamental para piernas','Piernas','Barra'),(48,'Prensa de Piernas','Ejercicio compuesto para cuádriceps en máquina','Piernas','Máquina'),(49,'Zancadas con Mancuernas','Ejercicio unilateral para piernas y glúteos','Piernas','Mancuerna'),(50,'Curl Femoral','Ejercicio de aislamiento para isquiotibiales en máquina','Piernas','Máquina'),(51,'Hip Thrust','Ejercicio para glúteos con barra o peso corporal','Glúteos','Barra'),(52,'Patada de Glúteo en Polea','Ejercicio de aislamiento para glúteos','Glúteos','Polea'),(53,'Peso Muerto Rumano','Ejercicio para glúteos e isquiotibiales con barra','Glúteos','Barra'),(54,'Crunch Abdominal','Ejercicio básico para abdomen superior','Abdomen','Peso Corporal'),(55,'Plancha','Ejercicio isométrico para core completo','Abdomen','Peso Corporal'),(56,'Russian Twist','Ejercicio para oblicuos con peso corporal o mancuerna','Abdomen','Peso Corporal'),(57,'Carrera en Cinta','Ejercicio cardiovascular de intensidad variable','Cardio','Cardio'),(58,'Burpees','Ejercicio de cardio de alta intensidad con peso corporal','Cardio','Peso Corporal'),(59,'Kettlebell Swing','Ejercicio explosivo para cardio y glúteos','Full Body','Kettlebell'),(60,'TRX Row','Ejercicio de espalda usando bandas de suspensión','Espalda','TRX');
/*!40000 ALTER TABLE `ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenamiento`
--

DROP TABLE IF EXISTS `entrenamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenamiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_rutina` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `serie` int NOT NULL,
  `repeticion` int DEFAULT NULL,
  `tiempo` varchar(25) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_ejercicio` (`id_ejercicio`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_entrenamiento_id_usuario` (`id_usuario`),
  KEY `idx_entrenamiento_id_rutina` (`id_rutina`),
  KEY `idx_entrenamiento_id_ejercicio` (`id_ejercicio`),
  CONSTRAINT `entrenamiento_ibfk_1` FOREIGN KEY (`id_rutina`) REFERENCES `rutina` (`id`) ON DELETE CASCADE,
  CONSTRAINT `entrenamiento_ibfk_2` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenamiento`
--

LOCK TABLES `entrenamiento` WRITE;
/*!40000 ALTER TABLE `entrenamiento` DISABLE KEYS */;
INSERT INTO `entrenamiento` VALUES (1,12,1,1,'2026-01-29 19:19:10',1,8,NULL,80.00),(2,13,2,2,'2026-01-29 19:19:10',1,6,NULL,90.00),(3,14,3,3,'2026-01-29 19:19:10',1,8,NULL,70.00),(4,15,4,6,'2026-01-29 19:19:10',1,8,NULL,60.00),(5,16,5,8,'2026-01-29 19:19:10',1,12,NULL,140.00),(6,17,6,4,'2026-01-29 19:19:10',1,8,NULL,35.00),(7,18,7,15,'2026-01-29 19:19:10',1,12,NULL,35.00),(8,19,8,19,'2026-01-29 19:19:10',1,12,'3 min',NULL),(9,20,9,11,'2026-01-29 19:19:10',1,NULL,'60 s',NULL),(10,21,10,30,'2026-01-29 19:19:10',1,NULL,'20 min',NULL),(11,12,1,1,'2026-01-29 19:19:10',2,8,NULL,80.00),(12,13,2,2,'2026-01-29 19:19:10',2,6,NULL,90.00),(13,14,3,3,'2026-01-29 19:19:10',2,8,NULL,70.00),(14,15,4,6,'2026-01-29 19:19:10',2,8,NULL,60.00),(15,16,5,8,'2026-01-29 19:19:10',2,12,NULL,140.00),(16,17,6,4,'2026-01-29 19:19:10',2,8,NULL,35.00),(17,18,7,15,'2026-01-29 19:19:10',2,12,NULL,35.00),(18,19,8,19,'2026-01-29 19:19:10',2,12,'3 min',NULL),(19,20,9,11,'2026-01-29 19:19:10',2,NULL,'60 s',NULL),(20,21,10,30,'2026-01-29 19:19:10',2,NULL,'20 min',NULL),(21,12,1,1,'2026-01-29 19:19:10',3,8,NULL,80.00),(22,13,2,2,'2026-01-29 19:19:10',3,6,NULL,90.00),(23,14,3,3,'2026-01-29 19:19:10',3,8,NULL,70.00),(24,15,4,6,'2026-01-29 19:19:10',3,8,NULL,60.00),(25,16,5,8,'2026-01-29 19:19:10',3,12,NULL,140.00),(26,17,6,4,'2026-01-29 19:19:10',3,8,NULL,35.00),(27,18,7,15,'2026-01-29 19:19:10',3,12,NULL,35.00),(28,19,8,19,'2026-01-29 19:19:10',3,12,'3 min',NULL),(29,20,9,11,'2026-01-29 19:19:10',3,NULL,'60 s',NULL),(30,21,10,30,'2026-01-29 19:19:10',3,NULL,'20 min',NULL),(31,45,1,1,'2026-01-29 19:19:10',4,8,NULL,100.00),(32,45,1,3,'2026-01-29 19:19:10',3,10,NULL,90.00),(33,45,1,5,'2026-01-29 19:19:10',2,7,NULL,0.00),(34,45,1,26,'2026-01-29 19:19:10',1,NULL,'100',0.00),(35,45,1,1,'2026-01-29 19:19:10',4,8,NULL,10.00),(36,45,1,3,'2026-01-29 19:19:10',3,12,NULL,0.00),(37,45,3,3,'2026-01-29 19:19:10',4,8,NULL,120.00),(38,45,1,26,'2026-01-29 19:19:10',1,NULL,NULL,0.00),(39,45,1,5,'2026-01-29 19:19:10',2,8,NULL,0.00),(40,45,1,1,'2026-01-29 19:20:10',4,8,'00:01:21',111.00),(41,45,1,3,'2026-01-29 19:20:10',3,12,NULL,0.00),(42,45,1,5,'2026-01-29 19:20:10',2,8,NULL,0.00),(43,45,1,26,'2026-01-29 19:20:10',1,NULL,NULL,0.00),(44,45,1,1,'2026-01-29 19:31:03',4,8,NULL,912.00),(45,45,1,3,'2026-01-29 19:31:03',3,12,NULL,912.00),(46,45,1,5,'2026-01-29 19:31:03',2,8,NULL,912.00),(47,45,1,26,'2026-01-29 19:31:03',1,NULL,NULL,912.00),(48,45,16,19,'2026-01-29 19:38:29',8,10,'00:02:00',0.00),(49,45,1,1,'2026-01-29 19:41:36',4,8,NULL,0.00),(50,45,1,3,'2026-01-29 19:41:36',3,12,NULL,0.00),(51,45,1,5,'2026-01-29 19:41:36',2,8,NULL,0.00),(52,45,1,26,'2026-01-29 19:41:36',1,NULL,NULL,0.00),(53,45,1,1,'2026-01-29 19:46:26',4,8,'21:21',0.00),(54,45,1,3,'2026-01-29 19:46:26',3,12,NULL,0.00),(55,45,1,5,'2026-01-29 19:46:26',2,8,NULL,0.00),(56,45,1,26,'2026-01-29 19:46:26',1,NULL,NULL,0.00);
/*!40000 ALTER TABLE `entrenamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_medida`
--

DROP TABLE IF EXISTS `historial_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medida` (
  `id_usuario` int NOT NULL,
  `fecha` date NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`fecha`),
  CONSTRAINT `historial_medida_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medida`
--

LOCK TABLES `historial_medida` WRITE;
/*!40000 ALTER TABLE `historial_medida` DISABLE KEYS */;
INSERT INTO `historial_medida` VALUES (12,'2025-11-01',82.50,1.78),(12,'2025-12-01',81.20,1.78),(12,'2026-01-01',80.40,1.78),(13,'2025-11-01',63.40,1.64),(13,'2025-12-01',62.80,1.64),(13,'2026-01-01',62.10,1.64),(14,'2025-11-01',90.10,1.82),(14,'2025-12-01',89.30,1.82),(14,'2026-01-01',88.70,1.82),(15,'2025-11-01',71.20,1.70),(15,'2025-12-01',70.60,1.70),(15,'2026-01-01',70.10,1.70),(16,'2025-11-01',77.80,1.75),(16,'2025-12-01',77.10,1.75),(16,'2026-01-01',76.40,1.75),(17,'2025-11-01',58.90,1.60),(17,'2025-12-01',58.40,1.60),(17,'2026-01-01',57.90,1.60),(18,'2025-11-01',85.30,1.79),(18,'2025-12-01',84.60,1.79),(18,'2026-01-01',83.90,1.79),(19,'2025-11-01',69.70,1.67),(19,'2025-12-01',69.10,1.67),(19,'2026-01-01',68.50,1.67),(20,'2025-11-01',95.50,1.85),(20,'2025-12-01',94.20,1.85),(20,'2026-01-01',93.10,1.85),(21,'2025-11-01',60.20,1.62),(21,'2025-12-01',59.70,1.62),(21,'2026-01-01',59.20,1.62),(45,'2025-07-10',92.50,1.77),(45,'2025-07-24',91.80,1.77),(45,'2025-08-07',91.10,1.78),(45,'2025-08-21',90.40,1.78),(45,'2025-09-04',89.70,1.78),(45,'2025-09-18',89.00,1.78),(45,'2025-10-02',88.30,1.79),(45,'2025-10-16',87.60,1.79),(45,'2025-10-30',86.90,1.79),(45,'2025-11-13',86.20,1.79),(45,'2025-11-27',85.50,1.78),(45,'2025-12-11',84.90,1.78),(45,'2025-12-25',84.30,1.78),(45,'2026-01-08',83.80,1.78),(45,'2026-01-29',90.00,1.80);
/*!40000 ALTER TABLE `historial_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios`
--

DROP TABLE IF EXISTS `horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios` (
  `fecha_hora_desde` datetime NOT NULL,
  `fecha_hora_hasta` datetime DEFAULT NULL,
  `id_profesional` int NOT NULL,
  PRIMARY KEY (`id_profesional`,`fecha_hora_desde`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios`
--

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
INSERT INTO `horarios` VALUES ('2026-01-27 09:00:00','2026-01-27 12:00:00',2),('2026-01-27 14:00:00','2026-01-27 17:00:00',2),('2026-01-28 09:00:00','2026-01-28 12:00:00',2),('2026-01-27 09:00:00','2026-01-27 12:00:00',3),('2026-01-27 14:00:00','2026-01-27 17:00:00',3),('2026-01-28 09:00:00','2026-01-28 12:00:00',3),('2026-01-27 09:00:00','2026-01-27 12:00:00',4),('2026-01-27 14:00:00','2026-01-27 17:00:00',4),('2026-01-28 09:00:00','2026-01-28 12:00:00',4),('2026-01-27 09:00:00','2026-01-27 12:00:00',5),('2026-01-27 14:00:00','2026-01-27 17:00:00',5),('2026-01-28 09:00:00','2026-01-28 12:00:00',5),('2026-01-27 09:00:00','2026-01-27 12:00:00',6),('2026-01-27 14:00:00','2026-01-27 17:00:00',6),('2026-01-28 09:00:00','2026-01-28 12:00:00',6),('2026-01-27 09:00:00','2026-01-27 12:00:00',7),('2026-01-27 14:00:00','2026-01-27 17:00:00',7),('2026-01-28 09:00:00','2026-01-28 12:00:00',7),('2026-01-27 09:00:00','2026-01-27 12:00:00',8),('2026-01-27 14:00:00','2026-01-27 17:00:00',8),('2026-01-28 09:00:00','2026-01-28 12:00:00',8),('2026-01-27 09:00:00','2026-01-27 12:00:00',9),('2026-01-27 14:00:00','2026-01-27 17:00:00',9),('2026-01-28 09:00:00','2026-01-28 12:00:00',9),('2026-01-27 09:00:00','2026-01-27 12:00:00',10),('2026-01-27 14:00:00','2026-01-27 17:00:00',10),('2026-01-28 09:00:00','2026-01-28 12:00:00',10),('2026-01-27 09:00:00','2026-01-27 12:00:00',11),('2026-01-27 14:00:00','2026-01-27 17:00:00',11),('2026-01-28 09:00:00','2026-01-28 12:00:00',11);
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingrediente`
--

DROP TABLE IF EXISTS `ingrediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingrediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingrediente`
--

LOCK TABLES `ingrediente` WRITE;
/*!40000 ALTER TABLE `ingrediente` DISABLE KEYS */;
INSERT INTO `ingrediente` VALUES (1,'Pechuga de pollo','Alta en proteína magra'),(2,'Arroz integral','Carbo complejo, más fibra'),(3,'Avena','Carbo + fibra, ideal desayuno'),(4,'Banana','Carbo rápido + potasio'),(5,'Huevo','Proteína completa y grasas'),(6,'Atún','Proteína + omega-3'),(7,'Yogur natural','Proteína y probióticos'),(8,'Leche descremada','Proteína y calcio'),(9,'Aceite de oliva','Grasa saludable'),(10,'Palta','Grasas y fibra'),(11,'Espinaca','Micros y fibra'),(12,'Tomate','Vitaminas y antioxidantes'),(13,'Zanahoria','Beta caroteno'),(14,'Lentejas','Proteína vegetal + fibra'),(15,'Garbanzos','Legumbre energética'),(16,'Carne magra','Proteína y hierro'),(17,'Pasta integral','Carbo complejo'),(18,'Queso descremado','Proteína + calcio'),(19,'Ajo','Sabor y micronutrientes'),(20,'Cebolla','Sabor base'),(21,'Pimiento','Vitamina C'),(22,'Manzana','Fibra y saciedad'),(23,'Frutilla','Vitamina C'),(24,'Almendras','Grasas y proteína'),(25,'Miel','Endulzante natural'),(26,'Pan integral','Carbo complejo'),(27,'Salmón','Omega-3 alto'),(28,'Papa','Carbo, buena para rendimiento'),(29,'Brócoli','Fibra y micros'),(30,'Cacao amargo','Antioxidantes');
/*!40000 ALTER TABLE `ingrediente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingrediente_receta`
--

DROP TABLE IF EXISTS `ingrediente_receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingrediente_receta` (
  `id_ingrediente` int NOT NULL,
  `id_receta` int NOT NULL,
  `cantidad_porcion` decimal(5,2) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_ingrediente`,`id_receta`),
  KEY `id_receta` (`id_receta`),
  CONSTRAINT `ingrediente_receta_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `receta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ingrediente_receta_ibfk_2` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingrediente` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingrediente_receta`
--

LOCK TABLES `ingrediente_receta` WRITE;
/*!40000 ALTER TABLE `ingrediente_receta` DISABLE KEYS */;
INSERT INTO `ingrediente_receta` VALUES (1,2,150.00,'g'),(1,11,160.00,'g'),(1,16,170.00,'g'),(1,27,160.00,'g'),(2,3,90.00,'g'),(2,20,90.00,'g'),(2,30,90.00,'g'),(3,1,80.00,'g'),(3,21,70.00,'g'),(5,6,2.00,'unidades'),(5,24,2.00,'unidades'),(7,9,170.00,'g'),(7,29,170.00,'g'),(8,17,250.00,'ml'),(11,18,80.00,'g'),(14,4,120.00,'g'),(14,13,100.00,'g'),(14,26,110.00,'g'),(15,10,130.00,'g'),(15,19,150.00,'g'),(16,15,180.00,'g'),(17,5,90.00,'g'),(17,22,90.00,'g'),(22,25,1.00,'unidad'),(24,14,30.00,'g'),(26,8,1.00,'unidad'),(27,7,180.00,'g'),(27,28,160.00,'g'),(28,12,250.00,'g'),(29,23,120.00,'g');
/*!40000 ALTER TABLE `ingrediente_receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `necesidad`
--

DROP TABLE IF EXISTS `necesidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `necesidad` (
  `id_usuario` int NOT NULL,
  `id_nutriente` int NOT NULL,
  `id_profesional` int DEFAULT NULL,
  `fecha` date NOT NULL,
  `cantidad_min` decimal(5,2) DEFAULT NULL,
  `cantidad_max` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`,`id_nutriente`,`fecha`),
  KEY `id_profesional` (`id_profesional`),
  KEY `id_nutriente` (`id_nutriente`),
  CONSTRAINT `necesidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `necesidad_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `necesidad_ibfk_3` FOREIGN KEY (`id_nutriente`) REFERENCES `nutriente` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `necesidad`
--

LOCK TABLES `necesidad` WRITE;
/*!40000 ALTER TABLE `necesidad` DISABLE KEYS */;
INSERT INTO `necesidad` VALUES (12,1,2,'2026-01-01',120.00,160.00),(12,2,2,'2026-01-01',200.00,300.00),(12,3,2,'2026-01-01',60.00,90.00),(13,1,3,'2026-01-01',90.00,120.00),(13,2,3,'2026-01-01',160.00,240.00),(13,4,3,'2026-01-01',25.00,40.00),(14,1,4,'2026-01-01',140.00,190.00),(14,2,4,'2026-01-01',220.00,320.00),(14,18,4,'2026-01-01',0.30,0.45),(15,1,5,'2026-01-01',100.00,140.00),(15,2,5,'2026-01-01',180.00,260.00),(15,16,5,'2026-01-01',0.90,1.20),(16,1,6,'2026-01-01',110.00,150.00),(16,2,6,'2026-01-01',190.00,280.00),(16,20,6,'2026-01-01',2.50,3.50),(17,1,7,'2026-01-01',85.00,115.00),(17,2,7,'2026-01-01',150.00,220.00),(17,7,7,'2026-01-01',0.01,0.03),(18,1,8,'2026-01-01',130.00,175.00),(18,2,8,'2026-01-01',210.00,310.00),(18,3,8,'2026-01-01',65.00,95.00),(19,1,9,'2026-01-01',95.00,130.00),(19,2,9,'2026-01-01',170.00,250.00),(19,4,9,'2026-01-01',25.00,38.00),(20,1,10,'2026-01-01',150.00,200.00),(20,2,10,'2026-01-01',240.00,360.00),(20,3,10,'2026-01-01',70.00,105.00),(21,1,11,'2026-01-01',88.00,120.00),(21,2,11,'2026-01-01',155.00,230.00),(21,6,11,'2026-01-01',0.05,0.12);
/*!40000 ALTER TABLE `necesidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutriente`
--

DROP TABLE IF EXISTS `nutriente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutriente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutriente`
--

LOCK TABLES `nutriente` WRITE;
/*!40000 ALTER TABLE `nutriente` DISABLE KEYS */;
INSERT INTO `nutriente` VALUES (1,'Proteína','Macronutriente esencial para reparación muscular'),(2,'Carbohidratos','Fuente principal de energía'),(3,'Grasas','Energía y soporte hormonal'),(4,'Fibra','Salud digestiva y saciedad'),(5,'Vitamina A','Visión e inmunidad'),(6,'Vitamina C','Antioxidante, síntesis de colágeno'),(7,'Vitamina D','Salud ósea e inmunidad'),(8,'Vitamina E','Antioxidante'),(9,'Vitamina K','Coagulación y salud ósea'),(10,'B1 (Tiamina)','Metabolismo energético'),(11,'B2 (Riboflavina)','Metabolismo y piel'),(12,'B3 (Niacina)','Metabolismo energético'),(13,'B6 (Piridoxina)','Metabolismo de aminoácidos'),(14,'B9 (Folato)','Formación de ADN'),(15,'B12','Sistema nervioso y glóbulos rojos'),(16,'Calcio','Salud ósea'),(17,'Hierro','Transporte de oxígeno'),(18,'Magnesio','Función muscular'),(19,'Zinc','Inmunidad'),(20,'Potasio','Equilibrio de líquidos'),(21,'Sodio','Electrolito'),(22,'Omega-3','Grasas antiinflamatorias'),(23,'Colesterol','Componente estructural'),(24,'Agua','Hidratación'),(25,'Selenio','Antioxidante'),(26,'Fósforo','Energía (ATP) y huesos'),(27,'Yodo','Función tiroidea'),(28,'Cobre','Metabolismo del hierro'),(29,'Manganeso','Cofactor enzimático'),(30,'Cafeína','Estimulante (rendimiento)');
/*!40000 ALTER TABLE `nutriente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutriente_ingrediente`
--

DROP TABLE IF EXISTS `nutriente_ingrediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutriente_ingrediente` (
  `id_nutriente` int NOT NULL,
  `id_ingrediente` int NOT NULL,
  `cantidad` decimal(5,2) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_nutriente`,`id_ingrediente`),
  KEY `id_ingrediente` (`id_ingrediente`),
  CONSTRAINT `nutriente_ingrediente_ibfk_1` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingrediente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `nutriente_ingrediente_ibfk_2` FOREIGN KEY (`id_nutriente`) REFERENCES `nutriente` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutriente_ingrediente`
--

LOCK TABLES `nutriente_ingrediente` WRITE;
/*!40000 ALTER TABLE `nutriente_ingrediente` DISABLE KEYS */;
INSERT INTO `nutriente_ingrediente` VALUES (1,1,31.00,'g/100g'),(1,6,25.00,'g/100g'),(1,7,3.50,'g/100g'),(1,14,9.00,'g/100g'),(1,15,8.50,'g/100g'),(1,16,26.00,'g/100g'),(1,18,28.00,'g/100g'),(2,2,23.00,'g/100g'),(2,3,60.00,'g/100g'),(2,4,23.00,'g/100g'),(2,17,65.00,'g/100g'),(2,28,17.00,'g/100g'),(3,5,11.00,'g/100g'),(3,9,100.00,'g/100g'),(3,10,15.00,'g/100g'),(3,24,50.00,'g/100g'),(4,2,2.00,'g/100g'),(4,3,10.00,'g/100g'),(4,10,7.00,'g/100g'),(4,11,2.20,'g/100g'),(4,14,8.00,'g/100g'),(4,15,7.60,'g/100g'),(4,22,2.40,'g/100g'),(4,29,2.60,'g/100g'),(5,13,0.84,'g/100g'),(6,12,0.02,'g/100g'),(6,21,0.13,'g/100g'),(6,23,0.06,'g/100g'),(8,30,0.01,'g/100g'),(16,8,0.12,'g/100ml'),(16,18,0.60,'g/100g'),(17,16,0.00,'g/100g'),(20,4,0.36,'g/100g'),(22,27,2.50,'g/100g');
/*!40000 ALTER TABLE `nutriente_ingrediente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_profesional` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nivel_dificultad` enum('BAJO','MEDIO','ALTO') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_profesional` (`id_profesional`),
  CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
INSERT INTO `receta` VALUES (1,2,'Bowl de avena y banana','Avena cocida con banana y cacao','BAJO'),(2,2,'Ensalada de pollo','Pollo, espinaca, tomate, oliva','BAJO'),(3,3,'Arroz integral con atún','Plato rápido post-entreno','BAJO'),(4,3,'Lentejas guisadas','Lentejas con vegetales','MEDIO'),(5,4,'Pasta integral con carne','Carne magra y pasta integral','MEDIO'),(6,4,'Omelette de espinaca','Huevos con espinaca','BAJO'),(7,5,'Salmón al horno','Salmón con brócoli','MEDIO'),(8,5,'Wrap integral','Pan integral con pollo y palta','BAJO'),(9,6,'Yogur con frutas','Yogur natural con frutilla','BAJO'),(10,6,'Garbanzos salteados','Garbanzos con pimiento y cebolla','MEDIO'),(11,7,'Pollo al ajo','Pollo con ajo y zanahoria','MEDIO'),(12,7,'Tortilla de papa','Versión liviana al horno','ALTO'),(13,8,'Bowl vegetariano','Lentejas, arroz integral y verduras','MEDIO'),(14,8,'Snack de almendras','Porción controlada','BAJO'),(15,9,'Hamburguesa casera magra','Carne magra, pan integral','MEDIO'),(16,9,'Pechuga grillada','Clásico de definición','BAJO'),(17,10,'Smoothie proteico','Leche, banana, cacao y yogur','BAJO'),(18,10,'Ensalada completa','Espinaca, tomate, huevo, oliva','BAJO'),(19,11,'Guiso de garbanzos','Legumbres con vegetales','ALTO'),(20,11,'Arroz con pollo','Arroz integral con pollo','MEDIO'),(21,2,'Avena overnight','Avena en frío con yogur','BAJO'),(22,3,'Pasta con atún','Pasta integral con atún','BAJO'),(23,4,'Carne con brócoli','Salteado rápido','MEDIO'),(24,5,'Huevos revueltos','Huevos con tomate','BAJO'),(25,6,'Manzana con miel y cacao','Postre simple','BAJO'),(26,7,'Ensalada de lentejas','Lentejas con cebolla y pimiento','MEDIO'),(27,8,'Pollo con arroz y vegetales','Meal prep','MEDIO'),(28,9,'Salmón con palta','Grasas saludables','MEDIO'),(29,10,'Yogur + avena + frutas','Desayuno completo','BAJO'),(30,11,'Bowl post-entreno','Arroz, pollo, tomate','BAJO');
/*!40000 ALTER TABLE `receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina`
--

DROP TABLE IF EXISTS `rutina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina`
--

LOCK TABLES `rutina` WRITE;
/*!40000 ALTER TABLE `rutina` DISABLE KEYS */;
INSERT INTO `rutina` VALUES (1,'Full Body A','Rutina full body base'),(2,'Full Body B','Full body con énfasis posterior'),(3,'Push A','Pecho/hombro/tríceps'),(4,'Pull A','Espalda/bíceps'),(5,'Legs A','Pierna completa'),(6,'Upper A','Tren superior completo'),(7,'Lower A','Tren inferior completo'),(8,'HIIT 20','Intervalos de alta intensidad 20 min'),(9,'Core 15','Core y estabilidad 15 min'),(10,'Movilidad','Movilidad general y estiramientos'),(11,'Hipertrofia 1','Volumen moderado-alto'),(12,'Hipertrofia 2','Volumen alto'),(13,'Fuerza 1','Baja repetición, alta carga'),(14,'Fuerza 2','Fuerza + accesorios'),(15,'Resistencia 1','Circuito cuerpo completo'),(16,'Resistencia 2','Circuito con énfasis cardio'),(17,'GPP','Preparación física general'),(18,'Glúteos','Enfoque en glúteos'),(19,'Espalda Postura','Espalda y postura'),(20,'Brazos','Bíceps y tríceps'),(21,'Pecho','Enfoque pecho'),(22,'Hombros','Enfoque deltoides'),(23,'Piernas Potencia','Saltos y potencia'),(24,'Piernas Volumen','Alto volumen pierna'),(25,'Calistenia Básica','Dominadas/fondos/progresiones'),(26,'Running Fácil','Trote base'),(27,'Running Intervalos','Series cortas de carrera'),(28,'Ciclismo Base','Pedaleo continuo suave'),(29,'Ciclismo Intervalos','Intervalos en bici'),(30,'Recuperación Activa','Día suave, descarga');
/*!40000 ALTER TABLE `rutina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina_cliente`
--

DROP TABLE IF EXISTS `rutina_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina_cliente` (
  `id_usuario` int NOT NULL,
  `id_rutina` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_rutina`),
  KEY `id_rutina` (`id_rutina`),
  CONSTRAINT `rutina_cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rutina_cliente_ibfk_2` FOREIGN KEY (`id_rutina`) REFERENCES `rutina` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina_cliente`
--

LOCK TABLES `rutina_cliente` WRITE;
/*!40000 ALTER TABLE `rutina_cliente` DISABLE KEYS */;
INSERT INTO `rutina_cliente` VALUES (12,1),(45,1),(13,2),(14,3),(45,3),(15,4),(16,5),(17,6),(18,7),(45,7),(19,8),(20,9),(21,10),(22,11),(23,12),(24,13),(25,14),(26,15),(27,16),(45,16),(28,17),(29,18),(30,19),(31,20),(32,21),(33,22),(34,23),(35,24),(36,25),(37,26),(38,27),(39,28),(40,29),(41,30);
/*!40000 ALTER TABLE `rutina_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina_ejercicio`
--

DROP TABLE IF EXISTS `rutina_ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina_ejercicio` (
  `id_rutina` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `series_aproximadas` int DEFAULT NULL,
  `repeticiones_aproximadas` int DEFAULT NULL,
  `tiempo_aproximado` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id_rutina`,`id_ejercicio`),
  KEY `id_ejercicio` (`id_ejercicio`),
  CONSTRAINT `rutina_ejercicio_ibfk_1` FOREIGN KEY (`id_rutina`) REFERENCES `rutina` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rutina_ejercicio_ibfk_2` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina_ejercicio`
--

LOCK TABLES `rutina_ejercicio` WRITE;
/*!40000 ALTER TABLE `rutina_ejercicio` DISABLE KEYS */;
INSERT INTO `rutina_ejercicio` VALUES (1,1,4,8,NULL),(1,3,3,12,''),(1,5,2,8,''),(1,26,1,NULL,'100'),(2,2,4,6,NULL),(3,3,4,8,NULL),(4,6,4,8,NULL),(5,8,4,12,NULL),(6,4,4,8,NULL),(7,15,4,12,NULL),(8,19,6,12,'20 min'),(9,11,3,0,'15 min'),(10,30,1,0,'25 min'),(11,23,5,10,NULL),(12,22,5,12,NULL),(13,1,5,5,NULL),(14,2,5,5,NULL),(15,21,5,20,'25 min'),(16,19,8,10,'25 min'),(17,7,4,12,NULL),(18,17,5,10,NULL),(19,24,4,15,NULL),(20,9,4,12,NULL),(21,3,5,8,NULL),(22,13,4,15,NULL),(23,20,5,5,NULL),(24,16,4,15,NULL),(25,5,4,6,NULL),(26,26,1,0,'30 min'),(27,27,8,1,'20 min'),(28,28,1,0,'40 min'),(29,28,1,0,'30 min'),(30,30,1,0,'30 min');
/*!40000 ALTER TABLE `rutina_ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `tipo_usu` int NOT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin','Admin','t@t','a',1,'admin',1,NULL),(2,'Lucía','Gómez','lucia.gomez@jartraining.com','pass123',1,'luciag',2,'Nutricionista'),(3,'Martín','Pérez','martin.perez@jartraining.com','pass123',1,'martinp',2,'Nutricionista'),(4,'Sofía','Rodríguez','sofia.rodriguez@jartraining.com','pass123',1,'sofiar',2,'Entrenadora'),(5,'Nicolás','Fernández','nicolas.fernandez@jartraining.com','pass123',1,'nicofer',2,'Entrenador'),(6,'Valentina','López','valentina.lopez@jartraining.com','pass123',1,'valelo',2,'Nutricionista'),(7,'Tomás','Díaz','tomas.diaz@jartraining.com','pass123',1,'tomasd',2,'Entrenador'),(8,'Camila','Martínez','camila.martinez@jartraining.com','pass123',1,'camilam',2,'Nutricionista'),(9,'Juan','Sosa','juan.sosa@jartraining.com','pass123',1,'juans',2,'Entrenador'),(10,'Agustina','Romero','agustina.romero@jartraining.com','pass123',1,'agustinar',2,'Entrenadora'),(11,'Franco','Alvarez','franco.alvarez@jartraining.com','pass123',1,'francoa',2,'Nutricionista'),(12,'Bruno','Cáceres','bruno.caceres@jartraining.com','pass123',1,'brunoc',3,'Estudiante'),(13,'Micaela','Ibarra','micaela.ibarra@jartraining.com','pass123',1,'micaib',3,'Diseñadora'),(14,'Leandro','Molina','leandro.molina@jartraining.com','pass123',1,'leamol',3,'Analista'),(15,'Florencia','Ramos','florencia.ramos@jartraining.com','pass123',1,'floramos',3,'Docente'),(16,'Federico','Castro','federico.castro@jartraining.com','pass123',1,'fedcas',3,'Programador'),(17,'Julieta','Herrera','julieta.herrera@jartraining.com','pass123',1,'julih',3,'Administrativa'),(18,'Matías','Suárez','matias.suarez@jartraining.com','pass123',1,'mati_s',3,'Estudiante'),(19,'Carolina','Silva','carolina.silva@jartraining.com','pass123',1,'caros',3,'Abogada'),(20,'Gonzalo','Vega','gonzalo.vega@jartraining.com','pass123',1,'gonvega',3,'Vendedor'),(21,'Milagros','Navarro','milagros.navarro@jartraining.com','pass123',1,'milan',3,'Arquitecta'),(22,'Ignacio','Rivas','ignacio.rivas@jartraining.com','pass123',1,'nachor',3,'Estudiante'),(23,'Paula','Farias','paula.farias@jartraining.com','pass123',1,'paulaf',3,'Marketing'),(24,'Ezequiel','Peralta','ezequiel.peralta@jartraining.com','pass123',1,'ezeper',3,'Operario'),(25,'Belén','Ortega','belen.ortega@jartraining.com','pass123',1,'beleno',3,'Contadora'),(26,'Kevin','Torres','kevin.torres@jartraining.com','pass123',1,'kevtor',3,'Estudiante'),(27,'Noelia','Acosta','noelia.acosta@jartraining.com','pass123',1,'noeaco',3,'Enfermera'),(28,'Santiago','Méndez','santiago.mendez@jartraining.com','pass123',1,'santim',3,'Chef'),(29,'Rocío','Benítez','rocio.benitez@jartraining.com','pass123',1,'rociob',3,'Psicóloga'),(30,'Facundo','Paz','facundo.paz@jartraining.com','pass123',1,'facup',3,'Técnico'),(31,'Natalia','Cruz','natalia.cruz@jartraining.com','pass123',1,'natcruz',3,'Estudiante'),(32,'Diego','Luna','diego.luna@jartraining.com','pass123',1,'diegol',3,'Fotógrafo'),(33,'Cintia','Morales','cintia.morales@jartraining.com','pass123',1,'cintiam',3,'Diseñadora'),(34,'Joaquín','Vidal','joaquin.vidal@jartraining.com','pass123',1,'joaqv',3,'Estudiante'),(35,'Mariana','Domínguez','mariana.dominguez@jartraining.com','pass123',1,'marid',3,'Analista'),(36,'Pablo','Ruiz','pablo.ruiz@jartraining.com','pass123',1,'pablor',3,'Comerciante'),(37,'Lorena','Arias','lorena.arias@jartraining.com','pass123',1,'lorearias',3,'Docente'),(38,'Iván','Cabrera','ivan.cabrera@jartraining.com','pass123',1,'ivanc',3,'Estudiante'),(39,'Tamara','Sánchez','tamara.sanchez@jartraining.com','pass123',1,'tamaras',3,'RRHH'),(40,'Alan','Quiroga','alan.quiroga@jartraining.com','pass123',1,'alanq',3,'Programador'),(41,'Victoria','Ponce','victoria.ponce@jartraining.com','pass123',1,'vicpon',3,'Estudiante'),(42,'Bruno','Cascardo','bruno@bruno.com','brucascardo',0,'brucascardo',2,NULL),(45,'Bruno','Cascardo','brunocliente@bruno.com','bru',1,'bru',3,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-29 22:51:25
