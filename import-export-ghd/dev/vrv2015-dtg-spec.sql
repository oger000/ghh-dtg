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
-- Table structure for table `kennsatz`
--

DROP TABLE IF EXISTS `kennsatz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kennsatz` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `periode` char(1)  NOT NULL DEFAULT '',
  `gemeinde` varchar(250)  NOT NULL DEFAULT '',
  `verantwortlich` varchar(250)  NOT NULL DEFAULT '',
  `sachbearbeiter` varchar(250)  NOT NULL DEFAULT '',
  `telefon` varchar(250)  NOT NULL DEFAULT '',
  `email` varchar(250)  NOT NULL DEFAULT '',
  `version` varchar(120)  NOT NULL DEFAULT '',
  `edv` varchar(120)  NOT NULL DEFAULT '',
  `erstellt` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_fj0` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_fj1` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_mefp` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_fj0_nva` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_fj1_nva` varchar(10)  NOT NULL DEFAULT '',
  `beschlossen_mefp_nva` varchar(10)  NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `ergebnishaushalt`
--

DROP TABLE IF EXISTS `ergebnishaushalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ergebnishaushalt` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

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





DROP TABLE IF EXISTS `er_sektor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `er_sektor` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` char(1) NOT NULL DEFAULT '',
  `mvag_ehh` char(4) NOT NULL DEFAULT '',

  `sektor` char(4) NOT NULL DEFAULT '',
  `wert` decimal(20,2) NOT NULL DEFAULT '0.00',
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
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `hinweis` char(1) NOT NULL DEFAULT '',
  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` char(1) NOT NULL DEFAULT '',
  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `mvag_fhh` char(4) NOT NULL DEFAULT '',

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
) ENGINE=InnoDB AUTO_INCREMENT=1290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `fr_sektor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fr_sektor` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `verguetung` char(1) NOT NULL DEFAULT '',
  `mvag_fhh` char(4) NOT NULL DEFAULT '',

  `sektor` char(4) NOT NULL DEFAULT '',
  `wert` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3810 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `vermoegenshaushalt`
--

DROP TABLE IF EXISTS `vermoegenshaushalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vermoegenshaushalt` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `id_vhh` char(20) NOT NULL DEFAULT '',
  `sektor` char(4) NOT NULL DEFAULT '',
  `land` char(2) NOT NULL DEFAULT '',

  `mvag_vhh` char(4) NOT NULL DEFAULT '',
  `ansatz_text` varchar(250) NOT NULL DEFAULT '',
  `konto_text` varchar(250) NOT NULL DEFAULT '',
  `endstand_vj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zugang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `abgang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `aenderung` decimal(20,2) NOT NULL DEFAULT '0.00',

  `endstand_rj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `abschreibung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `umbuchung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `hoehe` decimal(20,2) NOT NULL DEFAULT '0.00',
  `ersaetze` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zinsen` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verzinsungsart` char(1) NOT NULL DEFAULT '',
  `waehrung` char(3) NOT NULL DEFAULT '',
  `laufzeit_von` varchar(6) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(6) NOT NULL DEFAULT '',
  `fbn` varchar(7) NOT NULL DEFAULT '',
  `isin` varchar(12) NOT NULL DEFAULT '',
  `notleidend` char(1) NOT NULL DEFAULT '',
  `minleasing` decimal(20,2) NOT NULL DEFAULT '0.00',
  `nachweis` varchar(250) NOT NULL DEFAULT '',
  `wechselkurs_zug` decimal(20,5) NOT NULL DEFAULT '0.00',
  `wechselkurs_vj` decimal(20,5) NOT NULL DEFAULT '0.00',
  `wechselkurs_rj` decimal(20,5) NOT NULL DEFAULT '0.00',
  `zinsanpassungstermin` varchar(6) NOT NULL DEFAULT '',

  `bonitaet` char(1) NOT NULL DEFAULT '',
  `ausfallrisiko` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zinssatz` decimal(15,5) NOT NULL DEFAULT '0.00000',
  `refzinssatz` varchar(250) NOT NULL DEFAULT '',
  `minzinssatz` decimal(15,5) NOT NULL DEFAULT '0.00000',
  `endstand_fj0` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj1` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj2` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj3` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj4` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj5` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=6534 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `operating_leasing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operating_leasing` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `id_operating_leasing` char(20) NOT NULL DEFAULT '',
  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `projekt` varchar(250) NOT NULL DEFAULT '',
  `gesamtkosten` decimal(20,2) NOT NULL DEFAULT '0.00',
  `einmalkaution` decimal(20,2) NOT NULL DEFAULT '0.00',
  `leasingentgelt` decimal(20,2) NOT NULL DEFAULT '0.00',
  `laufende_kaution` decimal(20,2) NOT NULL DEFAULT '0.00',
  `restzahlung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `laufzeit_von` varchar(6) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(6) NOT NULL DEFAULT '',
  `restlaufzeit` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3810 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `beteiligungen`
--

DROP TABLE IF EXISTS `beteiligungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beteiligungen` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `id` varchar(1024) NOT NULL DEFAULT '',
  `id_vhh` char(20) NOT NULL DEFAULT '',
  `name_einheit` varchar(250) NOT NULL DEFAULT '',
  `adresse` varchar(250) NOT NULL DEFAULT '',
  `postleitzahl` varchar(250) NOT NULL DEFAULT '',
  `ort` varchar(250) NOT NULL DEFAULT '',
  `sektor` char(4) NOT NULL DEFAULT '',
  `betverhaeltnis` char(1) NOT NULL DEFAULT '',
  `id_mutter` varchar(1024) NOT NULL DEFAULT '',
  `betausmass` decimal(7,3) NOT NULL DEFAULT '0.000',
  `gjahr_von` varchar(10)  NOT NULL DEFAULT '',
  `gjahr_bis` varchar(10)  NOT NULL DEFAULT '',
  `stammkapital` decimal(20,2) NOT NULL DEFAULT '0.00',
  `ekap_vj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `ekap_gj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `bilanzsumme` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_gesamt` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_finanz` decimal(20,2) NOT NULL DEFAULT '0.00',
  `verbindl_gk` decimal(20,2) NOT NULL DEFAULT '0.00',
  `ueber_fehl` decimal(20,2) NOT NULL DEFAULT '0.00',
  `gewinnaus_gk` decimal(20,2) NOT NULL DEFAULT '0.00',
  `vzae` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe` decimal(10,2) NOT NULL DEFAULT '0.00',
  `guthaben` decimal(20,2) NOT NULL DEFAULT '0.00',
  `forderungen` decimal(20,2) NOT NULL DEFAULT '0.00',
  `gem_beitrag` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;




--
-- Table structure for table `haftungen`
--

DROP TABLE IF EXISTS `haftungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `haftungen` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `id` varchar(1024) NOT NULL DEFAULT '',
  `id_haftung` char(20) NOT NULL DEFAULT '',
  `teil` char(2) NOT NULL DEFAULT '',
  `gruppe` char(1) NOT NULL DEFAULT '',
  `haftungsnehmer` varchar(250) NOT NULL DEFAULT '',
  `sektor` char(4) NOT NULL DEFAULT '',
  `laufzeit_von` varchar(6) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(6) NOT NULL DEFAULT '',
  `solidar` char(1) NOT NULL DEFAULT '',
  `anteil` decimal(7,3) NOT NULL DEFAULT '0.000',
  `haftungsrahmen` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_vj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zugang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `abgang` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_rj` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj1` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj2` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj3` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj4` decimal(20,2) NOT NULL DEFAULT '0.00',
  `endstand_fj5` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `ppp_projekt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ppp_projekt` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `projekt` varchar(250) NOT NULL DEFAULT '',
  `betreiber` varchar(250) NOT NULL DEFAULT '',
  `investitionsvolumen` decimal(20,2) NOT NULL DEFAULT '0.00',
  `nutzungsentgelt` decimal(20,2) NOT NULL DEFAULT '0.00',
  `zusatzzahlung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `restzahlung` decimal(20,2) NOT NULL DEFAULT '0.00',
  `art_zusatzzahlung` varchar(250) NOT NULL DEFAULT '',
  `baubeginn` varchar(6) NOT NULL DEFAULT '',
  `bauende` varchar(6) NOT NULL DEFAULT '',
  `betriebsbeginn` varchar(6) NOT NULL DEFAULT '',
  `betriebsende` varchar(6) NOT NULL DEFAULT '',
  `vertragsaenderung` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;




--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `meldegruppe` char(1) NOT NULL DEFAULT '',
  `personenkreis` char(1) NOT NULL DEFAULT '',
  `vzae` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vzae_fj0` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe_fj0` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vzae_fj1` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe_fj1` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `pension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pension` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `fj_nr` int NOT NULL DEFAULT '0',
  `aufwendungen` decimal(20,2) NOT NULL DEFAULT '0.00',
  `koepfe_r` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe_rl` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe_v` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe_vl` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
/*!40101 SET character_set_client = @saved_cs_client */;



DROP TABLE IF EXISTS `oestp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oestp` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `id_oestp` char(3) NOT NULL DEFAULT '',
  `vzae` decimal(10,2) NOT NULL DEFAULT '0.00',
  `koepfe` decimal(10,2) NOT NULL DEFAULT '0.00',
  `penshoehe` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pensalter` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
/*!40101 SET character_set_client = @saved_cs_client */;




DROP TABLE IF EXISTS `kultur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kultur` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `id_kultur` char(3) NOT NULL DEFAULT '',
  `ansatz_uab` char(3) NOT NULL DEFAULT '',
  `ansatz_ugl` char(3) NOT NULL DEFAULT '',
  `konto_grp` char(3) NOT NULL DEFAULT '',
  `konto_ugl` char(3) NOT NULL DEFAULT '',
  `sonst_ugl` char(3) NOT NULL DEFAULT '',
  `art` char(1) NOT NULL DEFAULT '',
  `bezeichnung` varchar(250) NOT NULL DEFAULT '',
  `standort` varchar(250) NOT NULL DEFAULT '',
  `anzahl` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
/*!40101 SET character_set_client = @saved_cs_client */;


-- Table structure for table `vorhaben`
--

DROP TABLE IF EXISTS `vorhaben`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vorhaben` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `vorhabencode` char(7) NOT NULL DEFAULT '',
  `bezeichnung` varchar(250) NOT NULL DEFAULT '',
  `zeitraum` char(7) NOT NULL DEFAULT '',
  `laufzeit_von` varchar(6) NOT NULL DEFAULT '',
  `laufzeit_bis` varchar(6) NOT NULL DEFAULT '',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `sonstige_daten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sonstige_daten` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `va_ra` char(2) NOT NULL DEFAULT '',
  `nva` int NOT NULL DEFAULT '0',
  `vrv` char(4) NOT NULL DEFAULT '',

  `finanzjahr` decimal(4,0) NOT NULL DEFAULT '0',
  `quartal` char(1) NOT NULL DEFAULT '',
  `gkz` char(5) NOT NULL DEFAULT '',

  `hebesatz1` int NOT NULL DEFAULT '0',
  `hebesatz2` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;






/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-31 23:17:30
