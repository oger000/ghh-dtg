-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: gemeindehaushalt
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



--
-- Table structure for table `vrv_ansatzgruppe`
--

DROP TABLE IF EXISTS `vrv_ansaetze`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_ansaetze` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4)  NOT NULL,
  `ansatz` char(3) NOT NULL,
  `name` varchar(512)  NOT NULL,
  PRIMARY KEY (`iid`),
  UNIQUE KEY `ansatz` (`ansatz`)
) ENGINE=InnoDB AUTO_INCREMENT=493 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vrv_kontogruppe`
--

DROP TABLE IF EXISTS `vrv_konten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_konten` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4)  NOT NULL DEFAULT '',
  `konto` char(3)  NOT NULL DEFAULT '',
  `name` varchar(512)  NOT NULL DEFAULT '',
  `ehh_e2` varchar(4) NOT NULL DEFAULT '',
  `fhh_ein_e2` varchar(4) NOT NULL DEFAULT '',
  `fhh_aus_e2` varchar(4) NOT NULL DEFAULT '',
  `vhh_e2` varchar(4) NOT NULL DEFAULT '',
  `quer_ein` varchar(4) NOT NULL DEFAULT '',
  `quer_aus` varchar(4) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`),
  UNIQUE KEY `konto` (`konto`)
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;





DROP TABLE IF EXISTS `vrv_ehh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_ehh` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4)  NOT NULL DEFAULT '',
  `mvag` char(4)  NOT NULL DEFAULT '',
  `name` varchar(512)  NOT NULL DEFAULT '',
  `ebene` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`),
  UNIQUE KEY `mvag` (`mvag`)
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


DROP TABLE IF EXISTS `vrv_fhh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_fhh` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4)  NOT NULL DEFAULT '',
  `mvag` char(4)  NOT NULL DEFAULT '',
  `name` varchar(512)  NOT NULL DEFAULT '',
  `ebene` varchar(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`),
  UNIQUE KEY `mvag` (`mvag`)
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;



DROP TABLE IF EXISTS `vrv_vhh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_vhh` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4)  NOT NULL DEFAULT '',
  `mvag` char(4)  NOT NULL DEFAULT '',
  `position` varchar(80) NOT NULL DEFAULT '',
  `name` varchar(512)  NOT NULL DEFAULT '',
  `ebene` varchar(80) NOT NULL DEFAULT '',
  `aktpas` char(80) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`),
  UNIQUE KEY `mvag` (`mvag`)
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;



















/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-31 23:17:30
