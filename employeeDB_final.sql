CREATE DATABASE  IF NOT EXISTS `employeedb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `employeedb`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: employeedb
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `comp_id` int NOT NULL AUTO_INCREMENT,
  `comp_name` varchar(45) NOT NULL,
  `comp_mobile` varchar(15) NOT NULL,
  `comp_email` varchar(45) DEFAULT NULL,
  `comp_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`comp_id`),
  UNIQUE KEY `mobile_UNIQUE` (`comp_mobile`),
  UNIQUE KEY `email_UNIQUE` (`comp_email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Roshan','07883841728','roshan@roshan.af','kabul wazir akbar khan streen no 11 house no 201'),(2,'MTN','077777777','mtn@mtn.af',NULL),(3,'AWCC ','07000000','awcc@awcc.af',NULL),(6,'afghan telecom','02000020','afgt@afg.af','kabul ');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_contacts`
--

DROP TABLE IF EXISTS `company_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_contacts` (
  `cont_id` int NOT NULL AUTO_INCREMENT,
  `comp_id` int DEFAULT NULL,
  `cont_name` varchar(45) NOT NULL,
  `cont_mobile` varchar(15) NOT NULL,
  `cont_email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cont_id`),
  UNIQUE KEY `mobile_UNIQUE` (`cont_mobile`),
  UNIQUE KEY `email_UNIQUE` (`cont_email`),
  KEY `comp_id` (`comp_id`),
  CONSTRAINT `company_contacts_ibfk_1` FOREIGN KEY (`comp_id`) REFERENCES `company` (`comp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_contacts`
--

LOCK TABLES `company_contacts` WRITE;
/*!40000 ALTER TABLE `company_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_sales`
--

DROP TABLE IF EXISTS `customer_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `cust_id` int DEFAULT NULL,
  `comp_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trans_type_id` int DEFAULT NULL,
  `sale_date` datetime DEFAULT NULL,
  `amount` int NOT NULL,
  `payment` int NOT NULL,
  `reciept_no` int NOT NULL,
  `remarks` text,
  `balance` float DEFAULT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `cust_id` (`cust_id`),
  KEY `user_id` (`user_id`),
  KEY `trans_type_id` (`trans_type_id`),
  KEY `customer_sales_ibfk_2_idx` (`comp_id`),
  CONSTRAINT `customer_sales_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`cust_id`),
  CONSTRAINT `customer_sales_ibfk_2` FOREIGN KEY (`comp_id`) REFERENCES `company` (`comp_id`),
  CONSTRAINT `customer_sales_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `customer_sales_ibfk_4` FOREIGN KEY (`trans_type_id`) REFERENCES `transaction_type` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_sales`
--

LOCK TABLES `customer_sales` WRITE;
/*!40000 ALTER TABLE `customer_sales` DISABLE KEYS */;
INSERT INTO `customer_sales` VALUES (56,6,6,11,3,'2022-08-30 00:00:00',1000,920,1,'no remarks',NULL),(57,6,2,12,1,'2022-08-30 00:00:00',1000,1000,2,'no remarks',NULL),(58,2,1,13,2,'2022-08-30 00:00:00',10000,10000,3,'no remarks',NULL),(59,6,1,11,2,'2022-08-30 00:00:00',4000,4000,4,'no remarks',NULL),(61,3,6,15,2,'2022-11-03 00:00:00',4000,4000,4789,'no remarks',NULL);
/*!40000 ALTER TABLE `customer_sales` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_sales_update` AFTER UPDATE ON `customer_sales` FOR EACH ROW BEGIN
    IF OLD.amount <> new.amount OR OLD.payment <> new.payment THEN 
        INSERT INTO SalesChanges(sale_id, user_id,before_amount, after_amount, before_payment,after_payment)
        VALUES(old.sale_id, OLD.user_id, OLD.amount, new.amount, OLD.payment, new.payment);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_sales_delete` AFTER DELETE ON `customer_sales` FOR EACH ROW INSERT INTO SalesDelete(sale_id,cust_id,comp_id,user_id,trans_type_id,sale_date,amount,payment,reciept_no)
        VALUES(OLD.sale_id, OLD.cust_id, OLD.comp_id, OLD.user_id, OLD.trans_type_id, OLD.sale_date, OLD.amount, OLD.payment, OLD.reciept_no) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `cust_id` int NOT NULL AUTO_INCREMENT,
  `cust_u_id` varchar(45) NOT NULL,
  `cust_fname` varchar(45) NOT NULL,
  `cust_lname` varchar(45) NOT NULL,
  `cust_comi` varchar(45) NOT NULL,
  `cust_mobile` varchar(20) NOT NULL,
  `cust_email` varchar(45) DEFAULT NULL,
  `cust_address` varchar(255) DEFAULT NULL,
  `cust_reg_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cust_id`),
  UNIQUE KEY `mobile_UNIQUE` (`cust_mobile`),
  UNIQUE KEY `cust_u_id_UNIQUE` (`cust_u_id`),
  UNIQUE KEY `email_UNIQUE` (`cust_email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (2,'123','asad','khan','8','333','asad2@gmail.com','kandahar city','2022-07-16 00:00:00'),(3,'5477777','wali','khan','5','07993814726','wali@gmail.com','kabul city ','2022-07-16 00:00:00'),(6,'122','nazif','khan','10','07993841638','nazif.it@gmail.com','kabul city ','2022-08-30 00:00:00'),(7,'110','mujib','bahayee','7','07993841538','mujib@gmail.com','kandahar city','2022-08-30 00:00:00'),(12,'113','mujib','khan','7','07993841677','','','2022-08-30 00:00:00');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tazkira_id` int NOT NULL,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) DEFAULT NULL,
  `father_name` varchar(45) DEFAULT NULL,
  `mobile` varchar(15) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `reg_date` date DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tazkira_id_UNIQUE` (`tazkira_id`),
  UNIQUE KEY `mobile_UNIQUE` (`mobile`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,123456,'asad','khan','wali','799999','asad@gmail.com','kabul city','2020-03-12',1),(2,32654,'walid','khan','shah','7888888','walid@gmail.com','kabul city','2020-03-12',NULL),(15,45345,'nazif','mal','khan','7993841638','it@gmail.com','india',NULL,1),(16,455454,'nazif','sherzai','sher khan','7993825444','@nazif.itgmail.com','kabul','2022-08-26',1),(18,455111,'jamal','khan','abdullah','0799562418','jamalkamal@gmail.com','7895 kabul mail','2022-08-26',1);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_pictures`
--

DROP TABLE IF EXISTS `invoice_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_pictures` (
  `pic_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int DEFAULT NULL,
  `pic_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `pic_invoice_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `pic_invoice_no` int DEFAULT NULL,
  `comp_id` int DEFAULT NULL,
  `pic_image` text CHARACTER SET utf8mb3 COLLATE utf8_general_ci,
  `remarks` text,
  PRIMARY KEY (`pic_id`),
  KEY `invoice_picture_company_fk_idx` (`comp_id`),
  KEY `invoice_pictures_purchase` (`p_id`),
  CONSTRAINT `invoice_picture_company_fk` FOREIGN KEY (`comp_id`) REFERENCES `company` (`comp_id`),
  CONSTRAINT `invoice_pictures_purchase` FOREIGN KEY (`p_id`) REFERENCES `purchases` (`p_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_pictures`
--

LOCK TABLES `invoice_pictures` WRITE;
/*!40000 ALTER TABLE `invoice_pictures` DISABLE KEYS */;
INSERT INTO `invoice_pictures` VALUES (15,NULL,'2022-08-24 00:00:00','2022-08-24 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1661296127257.jpg','dfsdf'),(16,NULL,'2022-08-30 00:00:00','2022-08-30 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1661857538675.jpg',''),(17,NULL,'2022-08-31 00:00:00','2022-08-31 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1661941671149.jpg',''),(18,NULL,'2022-11-05 00:00:00','2022-11-05 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1667645100162.jpg',''),(19,NULL,'2022-11-05 00:00:00','2022-11-05 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1667645634633.jpg',''),(20,NULL,'2022-11-05 00:00:00','2022-11-05 00:00:00',NULL,NULL,'public\\images\\invoice_images\\invoice_img_1667647103380.jpg','');
/*!40000 ALTER TABLE `invoice_pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchasechanges`
--

DROP TABLE IF EXISTS `purchasechanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchasechanges` (
  `p_change_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `before_p_amount` int DEFAULT NULL,
  `after_P_amount` int DEFAULT NULL,
  `before_p_payment` int DEFAULT NULL,
  `after_p_payment` int DEFAULT NULL,
  `p_reciept_no` int DEFAULT NULL,
  `changedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`p_change_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchasechanges`
--

LOCK TABLES `purchasechanges` WRITE;
/*!40000 ALTER TABLE `purchasechanges` DISABLE KEYS */;
INSERT INTO `purchasechanges` VALUES (1,88,11,10000,10000,10000,0,NULL,'2022-11-06 10:20:30'),(2,89,12,10000,10000,500,0,5,'2022-11-06 10:29:25');
/*!40000 ALTER TABLE `purchasechanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchasedelete`
--

DROP TABLE IF EXISTS `purchasedelete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchasedelete` (
  `delete_id` int NOT NULL AUTO_INCREMENT,
  `p_id` int DEFAULT NULL,
  `comp_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trans_type_id` int DEFAULT NULL,
  `p_amount` int DEFAULT NULL,
  `p_payment` int DEFAULT NULL,
  `p_reciept_no` int DEFAULT NULL,
  `p_com` int DEFAULT NULL,
  `p_date` datetime DEFAULT NULL,
  `deletedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`delete_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchasedelete`
--

LOCK TABLES `purchasedelete` WRITE;
/*!40000 ALTER TABLE `purchasedelete` DISABLE KEYS */;
INSERT INTO `purchasedelete` VALUES (1,90,2,11,2,10000,500,6,5,'2022-08-31 06:00:38','2022-11-06 10:07:04'),(2,88,1,11,2,10000,0,8,10,'2022-08-30 16:33:11','2022-11-06 10:28:46');
/*!40000 ALTER TABLE `purchasedelete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `p_id` int NOT NULL AUTO_INCREMENT,
  `comp_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trans_type_id` int DEFAULT NULL,
  `p_amount` int NOT NULL,
  `p_payment` int NOT NULL,
  `p_reciept_no` int NOT NULL,
  `p_com` int NOT NULL,
  `p_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remarks` text,
  PRIMARY KEY (`p_id`),
  UNIQUE KEY `p_reciept_no_UNIQUE` (`p_reciept_no`),
  KEY `comp_id` (`comp_id`),
  KEY `user_id` (`user_id`),
  KEY `trans_type_id` (`trans_type_id`),
  CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`comp_id`) REFERENCES `company` (`comp_id`),
  CONSTRAINT `purchases_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `purchases_ibfk_4` FOREIGN KEY (`trans_type_id`) REFERENCES `transaction_type` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (89,2,12,2,10000,0,5,5,'2022-08-31 06:00:24','gg'),(91,2,11,2,10000,500,7,5,'2022-08-31 06:00:44','gg'),(92,2,13,2,10000,500,9,5,'2022-08-31 06:00:52','gg'),(96,3,12,1,10000,10000,12,5,'2022-08-31 06:02:00','mtn-bank'),(97,2,15,1,10000,10000,13,5,'2022-08-31 06:02:07','mtn-bank'),(98,2,12,1,10000,10000,14,5,'2022-08-31 06:02:14','mtn-bank'),(99,2,12,1,10000,10000,15,5,'2022-08-31 06:02:23','mtn-bank'),(100,1,12,1,10000,10000,16,5,'2022-08-31 06:02:36','roshan-bank'),(101,1,12,1,1000,1000,17,5,'2022-08-31 06:02:45','roshan-bank'),(102,1,12,1,1000,1000,18,5,'2022-08-31 06:02:54','roshan-bank'),(104,6,12,1,1000,1000,19,5,'2022-08-31 06:03:27','roshan-sarafi'),(105,2,12,3,10000,5000,20,5,'2022-08-31 06:03:49','roshan-cash'),(106,3,12,3,10000,15000,21,5,'2022-08-31 06:04:09','roshan-cash'),(107,6,12,3,10000,1000,22,5,'2022-08-31 06:04:28','telecom-cash'),(112,3,12,1,10000,10000,26,5,'2022-08-31 06:05:39','awccc-bank'),(113,3,12,1,10000,10000,27,10,'2022-08-31 06:05:57','awcc-bank'),(114,3,12,1,10000,10000,28,10,'2022-08-31 06:06:08','awcc-bank'),(115,6,12,1,10000,10000,30,5,'2022-08-31 06:20:04','no remarks'),(116,3,12,3,10000,10000,29,8,'2022-08-31 13:48:20','no remarks'),(117,3,12,2,10000,10000,31,8,'2022-08-31 13:49:24','no remarks'),(118,3,12,3,10000,10000,32,5,'2022-08-31 13:50:29','no remarks'),(120,1,12,2,10000,10000,33,5,'2022-08-31 13:56:20','no remarks'),(121,1,12,2,10000,10000,34,5,'2022-08-31 13:57:01','no remarks'),(122,1,12,3,10000,10000,35,5,'2022-08-31 14:11:51','no remarks'),(123,1,12,2,10000,10000,36,10,'2022-08-31 14:13:38','roshan-bank'),(124,1,11,2,10000,10000,37,10,'2022-08-31 14:39:31','no remarks'),(125,2,11,3,10000,10000,38,5,'2022-08-31 15:00:06','no remarks'),(126,1,11,2,10000,10000,40,5,'2022-08-31 15:00:35','good'),(127,1,11,2,10000,10000,41,5,'2022-08-31 15:12:57','no remarks'),(128,2,11,2,10000,10000,42,10,'2022-08-31 15:13:31','no remarks'),(129,2,11,1,10000,10000,44,10,'2022-08-31 15:35:31','no remarks'),(130,6,11,1,10000,1000,46,10,'2022-08-31 15:57:24','good'),(131,1,11,2,10000,10000,43,5,'2022-08-31 17:40:49','no remarks'),(132,1,11,2,10000,10000,45,5,'2022-08-31 18:30:40','no remarks'),(133,3,11,1,10000,10000,47,5,'2022-08-31 18:41:09','no remarks'),(134,1,11,1,10000,10000,48,5,'2022-08-31 18:42:09','good'),(135,1,11,3,10000,10000,49,10,'2022-08-31 18:43:49','good'),(136,3,11,2,1000,100,50,10,'2022-08-31 18:54:46','no remarks'),(137,6,11,1,1000,500,51,5,'2022-08-31 19:21:56','no remarks'),(138,1,NULL,2,10000,10000,777582,5,'2022-11-05 15:31:35',''),(139,2,NULL,3,10000,10000,33852147,5,'2022-11-05 15:57:52',''),(140,6,NULL,1,10000,1000,878963258,5,'2022-11-05 16:03:04',''),(141,1,NULL,2,10000,10000,3312345,5,'2022-11-05 16:09:34',''),(142,1,NULL,2,10000,10000,5852,5,'2022-11-05 16:12:42',''),(143,1,NULL,2,10000,10000,552147,5,'2022-11-05 16:14:43',''),(144,NULL,NULL,NULL,10000,10000,5521473,5,'2022-11-05 16:26:47',''),(145,NULL,NULL,NULL,10000,10000,5521073,5,'2022-11-05 16:27:24',''),(146,2,15,3,10000,10000,5521003,5,'2022-11-05 16:33:20',''),(147,1,15,2,10000,10000,777000,5,'2022-11-05 16:46:51',''),(148,1,15,2,10000,10000,777014,10,'2022-11-05 16:47:25',''),(149,1,15,2,10000,10000,7770146,10,'2022-11-05 16:47:33','');
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_purchase_update` AFTER UPDATE ON `purchases` FOR EACH ROW BEGIN
    IF OLD.p_amount <> new.p_amount OR OLD.p_payment <> new.p_payment THEN 
        INSERT INTO purchaseChanges(p_id, user_id,before_p_amount, after_p_amount, before_p_payment,after_p_payment, p_reciept_no)
        VALUES(old.p_id, OLD.user_id, OLD.p_amount, new.p_amount, OLD.p_payment, new.p_payment, OLD.p_reciept_no);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_purchase_delete` AFTER DELETE ON `purchases` FOR EACH ROW INSERT INTO purchasedelete(p_id,comp_id, user_id, trans_type_id, p_amount, p_payment, p_reciept_no, p_com, p_date)
        VALUES(OLD.p_id, OLD.comp_id, OLD.user_id, OLD.trans_type_id, OLD.p_amount, OLD.p_payment, OLD.p_reciept_no, OLD.p_com, OLD.p_date) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `saleschanges`
--

DROP TABLE IF EXISTS `saleschanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saleschanges` (
  `change_id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `before_amount` int DEFAULT NULL,
  `after_amount` int DEFAULT NULL,
  `before_payment` int DEFAULT NULL,
  `after_payment` int DEFAULT NULL,
  `changedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`change_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saleschanges`
--

LOCK TABLES `saleschanges` WRITE;
/*!40000 ALTER TABLE `saleschanges` DISABLE KEYS */;
INSERT INTO `saleschanges` VALUES (1,58,13,0,10000,10000,10000,'2022-11-06 14:37:02'),(2,56,11,1000,1000,100,920,'2022-11-06 14:37:17');
/*!40000 ALTER TABLE `saleschanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salesdelete`
--

DROP TABLE IF EXISTS `salesdelete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesdelete` (
  `sale_delete_id` int NOT NULL AUTO_INCREMENT,
  `sale_id` int DEFAULT NULL,
  `cust_id` int DEFAULT NULL,
  `comp_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `trans_type_id` int DEFAULT NULL,
  `sale_date` datetime DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `payment` int DEFAULT NULL,
  `reciept_no` int DEFAULT NULL,
  `deletedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sale_delete_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesdelete`
--

LOCK TABLES `salesdelete` WRITE;
/*!40000 ALTER TABLE `salesdelete` DISABLE KEYS */;
INSERT INTO `salesdelete` VALUES (1,62,3,6,15,2,'2022-11-03 00:00:00',4000,4000,4789,'2022-11-06 09:31:30');
/*!40000 ALTER TABLE `salesdelete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_type`
--

DROP TABLE IF EXISTS `transaction_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(45) NOT NULL,
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_name_UNIQUE` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_type`
--

LOCK TABLES `transaction_type` WRITE;
/*!40000 ALTER TABLE `transaction_type` DISABLE KEYS */;
INSERT INTO `transaction_type` VALUES (2,'bank'),(3,'cash'),(1,'sarafi');
/*!40000 ALTER TABLE `transaction_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int DEFAULT NULL,
  `user_name` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `user_reg_date` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  KEY `FK_users_employees` (`emp_id`),
  CONSTRAINT `FK_users_employees` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,2,'wali','12',0,'2022-08-27 00:00:00',NULL),(11,1,'asad','123',1,'2022-08-27 00:00:00',NULL),(12,1,'asad9','$2b$10$KPDtA5CLtFkPNfSeP/gN5OXtKXZn7Z8fkyOiv.6.ABhujnjqqusv6',1,'2022-08-29 00:00:00',NULL),(13,18,'jamal3','$2b$10$IO/v5bwnifcaq3bJA2iDE.6yZz4yWyB8RfV7TTIjfASwU8IxfAhTW',1,'2022-08-30 00:00:00',NULL),(14,1,'asad10','$2b$10$o/3DtAMsxMpWAkVOwwvuaO/6HPtXtM3HKGgpRFOokP24azRo6S/IC',1,'2022-08-30 00:00:00',NULL),(15,1,'asad2','$2b$10$EckaCqiwKRhj3NFpLcvager8qFkr/UkVv9VOFb.RxTxlLhdcZz58y',1,'2022-10-12 00:00:00','2022-11-06 16:17:00'),(16,1,'asad3','$2b$10$/TTPdz8E7na1f3uGycYKt.aU9sV9A5nC00r9PcDc8iQ3/5QNWC/Eq',0,'2022-10-12 00:00:00',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-06 21:34:45
