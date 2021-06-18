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
-- Table structure for table `beteiligungen`
--

DROP TABLE IF EXISTS `beteiligungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beteiligungen` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',


  `id_fbn` varchar(254) NOT NULL DEFAULT '',
  `id_vhh` varchar(254) NOT NULL DEFAULT '',
  `name_einheit` varchar(254) NOT NULL DEFAULT '',
  `adresse` varchar(254) NOT NULL DEFAULT '',
  `postleitzahl` varchar(254) NOT NULL DEFAULT '',
  `ort` varchar(254) NOT NULL DEFAULT '',
  `sektor` varchar(254) NOT NULL DEFAULT '',
  `betverhaeltnis` int NOT NULL DEFAULT '0',
  `betausmass` decimal(7,3) NOT NULL DEFAULT '0.000',
  `gjahr_von` date NOT NULL DEFAULT '0000-00-00',
  `gjahr_bis` date NOT NULL DEFAULT '0000-00-00',
  `stammkapital` decimal(20,2) NOT NULL DEFAULT '0.00',
  `ekap_vj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_gesamt` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_finanz` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_gk` decimal(20,2) NOT NULL DEFAULT '0.00',
  `vzae` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ergebnishaushalt`
--

DROP TABLE IF EXISTS `ergebnishaushalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ergebnishaushalt` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `nachtrag_num` int NOT NULL DEFAULT '0',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` char(1) NOT NULL DEFAULT '',

  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `mvag_ehh` char(4) NOT NULL DEFAULT '',
  `ansatz_text` varchar(250) NOT NULL DEFAULT '',
  `konto_text` varchar(250) NOT NULL DEFAULT '',
  `wert` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj0` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj1` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj2` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj3` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj4` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj5` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3810 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finanzierungshaushalt`
--

DROP TABLE IF EXISTS `finanzierungshaushalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finanzierungshaushalt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',
  `finanzjahr` int NOT NULL DEFAULT '0',
  `quartal` int NOT NULL DEFAULT '0',
  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `mvag_fhh` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ansatz_text` varchar(512) NOT NULL DEFAULT '',
  `konto_text` varchar(512) NOT NULL DEFAULT '',
  `wert` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj0` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj1` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj2` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj3` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj4` decimal(20,2) NOT NULL DEFAULT '0.00',
  `wert_fj5` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `haftungen`
--

DROP TABLE IF EXISTS `haftungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `haftungen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',
  `finanzjahr` int NOT NULL DEFAULT '0',
  `quartal` int NOT NULL DEFAULT '0',
  `id_uid` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `id_haftung` varchar(64) NOT NULL DEFAULT '',
  `teil` varchar(5) NOT NULL DEFAULT '',
  `gruppe` int NOT NULL DEFAULT '1',
  `haftungsnehmer` varchar(254) NOT NULL DEFAULT '',
  `sektor` varchar(32) NOT NULL DEFAULT '',
  `laufzeit_von` varchar(10) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(10) NOT NULL DEFAULT '',
  `solidar` int NOT NULL DEFAULT '0',
  `anteil` decimal(7,3) NOT NULL DEFAULT '0.000',
  `haftungsrahmen` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_vj` decimal(10,2) NOT NULL DEFAULT '0.00',
  `zugang` decimal(10,2) NOT NULL DEFAULT '0.00',
  `abgang` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_rj` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_fj1` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_fj2` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_fj3` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_fj4` decimal(10,2) NOT NULL DEFAULT '0.00',
  `endstand_fj5` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kennsatz`
--

DROP TABLE IF EXISTS `kennsatz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kennsatz` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `nachtrag_num` int NOT NULL DEFAULT '0',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `periode` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `gemeinde` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `verantwortlich` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `sachbearbeiter` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `telefon` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `version` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `edv` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `erstellt` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_fj0` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_fj1` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_mefp` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_fj0_nva` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_fj1_nva` date NOT NULL DEFAULT '0000-00-00',
  `beschlossen_mefp_nva` date NOT NULL DEFAULT '0000-00-00',

  `hebesatz1` int NOT NULL DEFAULT '0',
  `hebesatz2` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',
  `finanzjahr` int NOT NULL DEFAULT '0',
  `quartal` int NOT NULL DEFAULT '0',
  `ansatz_uab` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `meldegruppe` int NOT NULL DEFAULT '0',
  `personenkreis` int NOT NULL DEFAULT '0',
  `vzae` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vermoegenshaushalt`
--

DROP TABLE IF EXISTS `vermoegenshaushalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vermoegenshaushalt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',
  `finanzjahr` int NOT NULL DEFAULT '0',
  `quartal` int NOT NULL DEFAULT '0',
  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `mvag_vhh` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ansatz_text` varchar(512) NOT NULL DEFAULT '',
  `konto_text` varchar(512) NOT NULL DEFAULT '',
  `endstand_vj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zugang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `abgang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `aenderung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_rj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `hoehe` decimal(20,2) NOT NULL DEFAULT '0.00',
  `waehrung` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `id_vhh` char(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `sektor` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `land` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `fbn` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `verzinsungsart` int NOT NULL DEFAULT '0',
  `laufzeit_von` varchar(10) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(10) NOT NULL DEFAULT '',
  `zinssatz` decimal(10,5) NOT NULL DEFAULT '0.00000',
  `refzinssatz` varchar(254) NOT NULL DEFAULT '',
  `nachweis` varchar(254) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6534 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vorhaben`
--

DROP TABLE IF EXISTS `vorhaben`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vorhaben` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gegenstand` char(2) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',
  `finanzjahr` int NOT NULL DEFAULT '0',
  `quartal` int NOT NULL DEFAULT '0',
  `vorhabencode` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `bezeichnung` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `zeitraum` int NOT NULL DEFAULT '0',
  `laufzeit_von` varchar(10) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vrv_ansatzgruppe`
--

DROP TABLE IF EXISTS `vrv_ansatzgruppe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_ansatzgruppe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grpnum` char(3) NOT NULL,
  `name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grpnum` (`grpnum`)
) ENGINE=InnoDB AUTO_INCREMENT=493 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vrv_kontogruppe`
--

DROP TABLE IF EXISTS `vrv_kontogruppe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vrv_kontogruppe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vrv` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `grpnum` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ehh_e2` varchar(4) NOT NULL DEFAULT '',
  `fhh_ein_e2` varchar(4) NOT NULL DEFAULT '',
  `fhh_aus_e2` varchar(4) NOT NULL DEFAULT '',
  `vhh_e2` varchar(4) NOT NULL DEFAULT '',
  `quer_ein` varchar(4) NOT NULL DEFAULT '',
  `quer_aus` varchar(4) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `grpnum` (`grpnum`)
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
