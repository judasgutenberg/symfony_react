-- MySQL dump 10.13  Distrib 5.7.21, for Win64 (x86_64)
--
-- Host: localhost    Database: scheduler
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `shift`
--

DROP TABLE IF EXISTS `shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manager_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `break` float(10,2) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `manager_id` (`manager_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift`
--

LOCK TABLES `shift` WRITE;
/*!40000 ALTER TABLE `shift` DISABLE KEYS */;
INSERT INTO `shift` VALUES (1,9,1,7.54,'2018-08-14 19:00:00','2018-08-16 00:00:00','2018-08-15 12:00:00','2018-08-18 16:42:20'),(2,9,3,7.54,'2018-08-15 14:00:00','2018-08-15 15:00:00','2018-08-15 12:00:00','2018-08-15 12:00:00'),(3,9,NULL,7.54,'2018-08-15 19:00:00','2018-08-15 21:00:00','2018-08-15 12:00:00','2018-08-15 12:00:00'),(4,NULL,1,7.54,'2018-08-15 21:00:00','2018-08-15 22:00:00','2018-08-15 12:00:00','2018-08-15 12:00:00'),(5,9,2,66.54,'2018-08-13 19:16:12','2018-08-14 18:24:14','2018-08-15 12:00:00','2018-08-18 18:42:42'),(6,9,3,234234.00,'2018-08-08 10:00:00','2018-08-08 12:00:00','2018-08-18 18:44:42','2018-08-18 18:55:09'),(7,9,3,434534.00,'2018-07-01 11:00:00','2018-07-01 12:00:00','2018-08-18 18:45:23','2018-08-18 19:19:08'),(8,NULL,1,445.00,'2018-08-12 02:22:00','2018-08-12 04:22:00','2018-08-18 19:12:48','2018-08-18 20:42:11');
/*!40000 ALTER TABLE `shift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Gus','employee','gus@asecular.com','222-3332','2018-01-10 00:00:00','2018-01-10 00:00:00','011c945f30ce2cbafc452f39840f025693339c42'),(2,'Jenny Mothershead','employee','jennym@mothershead.com','84412312','2018-08-17 17:06:31','2018-08-17 17:10:05','011c945f30ce2cbafc452f39840f025693339c42'),(3,'Harold Johnson','employee','harold@mothershead.com',NULL,'2018-08-17 17:39:56','2018-08-17 17:39:56','011c945f30ce2cbafc452f39840f025693339c42'),(7,'Richard Pooker','employee','rpooker@dreamcat.com','5578899','2018-08-17 21:37:57','2018-08-17 21:37:57','011c945f30ce2cbafc452f39840f025693339c42'),(8,'Yerbal Spacetree','employee','yfoo@spacesuit.net','5556655','2018-08-17 21:47:02','2018-08-17 21:47:02','011c945f30ce2cbafc452f39840f025693339c42'),(9,'Oscar Poofer','manager','oscarpoof@dribble.org','8453401090','2018-08-17 21:48:56','2018-08-17 21:48:56','011c945f30ce2cbafc452f39840f025693339c42');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-19 13:25:16
