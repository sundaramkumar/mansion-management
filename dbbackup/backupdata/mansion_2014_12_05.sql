-- MySQL dump 10.13  Distrib 5.6.16, for Win32 (x86)
--
-- Host: localhost    Database: mansion
-- ------------------------------------------------------
-- Server version	5.6.16

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
-- Table structure for table `accountheads`
--

DROP TABLE IF EXISTS `accountheads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accountheads` (
  `accountHeadId` int(11) NOT NULL AUTO_INCREMENT,
  `accountHeadName` varchar(255) DEFAULT NULL,
  `type` enum('C','D') DEFAULT 'C',
  `opBalance` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`accountHeadId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountheads`
--

LOCK TABLES `accountheads` WRITE;
/*!40000 ALTER TABLE `accountheads` DISABLE KEYS */;
INSERT INTO `accountheads` VALUES (1,'Tea Expenses','D',NULL),(2,'EB Charges','C',NULL),(3,'Cleaning Charges','C',NULL),(4,'Charges for Coporation','C',NULL);
/*!40000 ALTER TABLE `accountheads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `expensesId` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `accountHeadId` int(11) DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `addedBy` int(11) NOT NULL,
  `addedOn` date NOT NULL,
  PRIMARY KEY (`expensesId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,'2014-11-01',1,64.00,NULL,1,'2014-11-11'),(2,'2014-11-11',2,1500.50,'by cheque',1,'2014-11-11'),(3,'2014-11-11',3,300.00,NULL,1,'2014-11-11'),(4,'2014-11-10',3,48.00,NULL,1,'2014-11-11'),(5,'2014-11-13',3,100.50,'',1,'2014-11-11'),(6,'2014-11-15',3,190.00,'',1,'2014-11-11'),(7,'2014-11-19',2,30000.00,'by cash',1,'2014-11-11'),(8,'2014-11-24',3,2333.00,'ghg',1,'2014-11-24'),(9,'2014-11-30',1,110.00,'by cash for tea to guests',1,'2014-11-30'),(10,'2014-11-30',4,650.00,'for cleaning the sewage block',1,'2014-11-30');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guests`
--

DROP TABLE IF EXISTS `guests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guests` (
  `guestId` int(11) NOT NULL AUTO_INCREMENT,
  `guestName` varchar(100) DEFAULT NULL,
  `fatherName` varchar(100) DEFAULT NULL,
  `nativePlace` varchar(100) DEFAULT NULL,
  `address` tinytext,
  `nativePhone` varchar(15) DEFAULT NULL,
  `permanentAddress` tinytext,
  `permanentPhone` varchar(15) DEFAULT NULL,
  `localAddress` tinytext,
  `localPhone` varchar(15) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `occupationAddress` tinytext NOT NULL,
  `occupationPhone` varchar(15) DEFAULT NULL,
  `mobile` varchar(12) NOT NULL,
  `lastResidenceAddress` tinytext,
  `lastResidencePhone` varchar(15) DEFAULT NULL,
  `reasonOfStay` enum('B','R','S','E') DEFAULT 'R',
  `joiningDate` date DEFAULT NULL,
  `vacatingDate` date DEFAULT NULL,
  `advanceAmount` decimal(6,2) DEFAULT NULL,
  `advanceDate` date DEFAULT NULL,
  `roomId` int(11) NOT NULL,
  `vehicleNo` varchar(15) DEFAULT NULL,
  `status` enum('S','V') NOT NULL DEFAULT 'S',
  `comments` tinytext,
  PRIMARY KEY (`guestId`),
  UNIQUE KEY `guestid_UNIQUE` (`guestId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guests`
--

LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` VALUES (1,'Vetri Pandian','Mariappan','Tirunelveli','Puthuamman koil Street\nThatchanallur\nTirunelveli','224734','Puthuamman koil Street\nThatchanallur\nTirunelveli','224734','Ellaiamman Koil Street\nAdyar','9003227717','Medical Rep','','78945621325','78945621325','51, Ellaiamman Koil Street\nAdyar','4634645547','E','2013-11-01','0000-00-00',1000.00,'2013-01-11',1,'TN09 BD 2768','S',''),(2,'Kumar','Sundaram','TVL','ovk street,\nviravanallur','287004','ovk street,\nviravanallur','287004','ellaiamman koil st\nadyar','22353803','Sw Engineer','','9003013383','9003013381','22 cross street\nbesant nagar','78437649','R','2014-11-07','0000-00-00',1000.00,'2014-11-07',1,'tn09bd 2768','S','my comments\nis to test the textarea\nnewlines'),(3,'Raman','Ganapathy','dfsdfsd','gsdgsdg','234234','gsdgsdg','234234','','','clerk','','21893484','7890987654','sdfsdfsd','24234234','R','2014-11-07','0000-00-00',9999.99,'2014-07-11',1,'4g7y67','S',''),(4,'Sivarajan','Kasi','dfsdfsd','gsdgsdg','234234','gsdgsdg','234234','','','marketting','','23235235','7864356778','sdfsdfsd','24234234','R','2014-11-07','0000-00-00',9999.99,'2014-07-11',1,'4g7y67','S',''),(5,'Raj','kumaran','dfsdfsd','gsdgsdg','234234','gsdgsdg','234234','','','driver','','36464758','9878905643','sdfsdfsd','24234234','R','2014-11-07','0000-00-00',9999.99,'2014-07-11',1,'4g7y67','S',''),(6,'newtester','newtester','asdasd','asfsdf','23423243','asfsdf','23423243','','',NULL,'',NULL,'23423467','asfdas  fsaf','2143213','R','2014-11-07','0000-00-00',3454.00,'2014-11-07',8,'124','S',''),(7,'Akash','Kumar','ksdlfnsdl','qklsdnflksdnf','34534534','qklsdnflksdnf','34534534','','','student','','2342342','9112343456','gdfgdfgd','23423423','S','2014-11-07','0000-00-00',2345.00,'2014-07-11',8,'343ge','S',''),(8,'sruthi','kumar','sdjkvnsd','ovk street, vvr','239u23','ovk street, tvl','239u23','','',NULL,'',NULL,'9725638401','sdfsdfsd','234r234234','R','2014-11-06','2014-11-14',3543.00,'2014-11-07',7,'dfg43','V',''),(9,'mani','pama','sdjksdfjksdjk','sdjkfjksdf\nsdlfjskdf\nsdfjsdf','3848394389','sdjkfjksdf\nsdlfjskdf\nsdfjsdf','3848394389','','',NULL,'',NULL,'23423423543','sdjkfjksdf\nsdlfjskdf\nsdfjsdf','234678333','R','2014-11-07','2014-11-15',1000.00,'2014-11-07',7,'43fd54','V',''),(10,'Vimal','Danush','Madurai','tester street\ntesting city','37823873283','tester street\ntesting city','37823873283','local address\nlocal city','948585898','Sw Engineer','','384950599','83249485','last residence address\nadayar','4984895785','E','2014-11-14','0000-00-00',2000.00,'2014-11-14',2,'tn09 aj 3386','S',''),(11,'Manoj','Pandian','Tiruenelveli','sannadhi street\nnear to market\ntown','2336456565','sannadhi street\nnear to market\ntown','2336456565','sannadhi street\nnear to market\ntown','2336456565','Studen','','2336456565','7123456789','','','S','2014-11-30','0000-00-00',2000.00,'2014-11-30',7,'tn09aj 3386','S',''),(12,'Majeed','Aliyar','Ramnad','west street;\nnorth avenue\nramnad','73784309','west street;\nnorth avenue\nramnad','73784309','','','Engineer','15, habibullah road\nt.nagar\nchennai-600 017','86436478','9841123456','','','E','2014-12-01','0000-00-00',2000.00,'2014-12-01',7,'','S','');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guestsproof`
--

DROP TABLE IF EXISTS `guestsproof`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guestsproof` (
  `proofId` int(11) NOT NULL AUTO_INCREMENT,
  `guestId` int(11) NOT NULL,
  `proof1` varchar(50) NOT NULL,
  `proof2` varchar(50) NOT NULL,
  `proof3` varchar(50) NOT NULL,
  `proof4` varchar(50) NOT NULL,
  `proof5` varchar(50) NOT NULL,
  PRIMARY KEY (`proofId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='id,address proof details of guests';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestsproof`
--

LOCK TABLES `guestsproof` WRITE;
/*!40000 ALTER TABLE `guestsproof` DISABLE KEYS */;
INSERT INTO `guestsproof` VALUES (1,7,'bill.april2013.jpg','bill.june2013.jpg','bill.march.2013.jpg','kumar.jpg','i94.JPG'),(2,1,'DSC00766.JPG','','','','');
/*!40000 ALTER TABLE `guestsproof` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipts` (
  `receiptId` int(11) NOT NULL AUTO_INCREMENT,
  `receiptNo` varchar(45) DEFAULT NULL,
  `billDate` date NOT NULL,
  `guestId` int(11) DEFAULT NULL,
  `month` varchar(15) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `addedBy` int(11) NOT NULL,
  `addedOn` date NOT NULL,
  PRIMARY KEY (`receiptId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (1,'BMA1','2014-11-13',7,'Nov 2014',1700.00,1,'2014-11-13'),(2,'BMA2','2014-10-13',7,'Oct 2014',1700.00,1,'2014-11-13'),(3,'BMA3','2014-09-13',7,'Sep 2014',1700.00,1,'2014-11-13'),(4,'BMA4','2014-08-13',7,'Aug 2014',1600.00,1,'2014-11-13'),(5,'BMA5','2014-08-13',1,'Aug 2014',1600.00,1,'2014-11-13'),(6,'BMA6','2014-10-13',8,'Oct 2014',1600.00,1,'2014-11-13'),(10,'BMA10','2014-09-13',8,'Sep 2014',1500.00,1,'2014-11-13'),(11,'BMA11','2014-07-15',7,'Jul 2014',1600.00,1,'2014-11-15'),(12,'BMA12','2014-11-30',11,'Nov 2014',1800.00,1,'2014-11-30'),(13,'BMA13','2014-11-30',2,'Nov 2014',1800.00,1,'2014-11-30'),(14,'BMA14','2014-11-30',10,'Nov 2014',1800.00,1,'2014-11-30'),(15,'BMA15','2014-10-30',2,'Oct 2014',1700.00,1,'2014-11-30'),(16,'BMA16','2014-09-11',2,'Sep 2014',1700.00,1,'2014-11-30'),(17,'BMA17','2014-12-01',7,'Dec 2014',2000.00,1,'2014-12-03');
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT,
  `roomNo` varchar(5) NOT NULL,
  `roomCapacity` decimal(2,0) DEFAULT NULL,
  `roomStatus` enum('E','F','P') DEFAULT 'E',
  `noOfGuests` decimal(2,0) DEFAULT '0',
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `roomid_UNIQUE` (`roomId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'101',5,'F',5),(2,'102',6,'P',6),(4,'104',6,'E',0),(5,'106',4,'E',0),(6,'105',6,'E',0),(7,'103',5,'E',4),(8,'107',2,'F',2),(9,'305',5,'E',0),(10,'109',4,'E',0);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `salname` varchar(5) NOT NULL,
  `realname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `addedon` date DEFAULT NULL,
  `addedby` int(11) DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `failedcount` int(11) DEFAULT '0',
  `usertype` enum('A','U') DEFAULT 'U',
  `status` enum('E','D') DEFAULT 'E' COMMENT 'If disabled cannot login',
  `loginip` varchar(25) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COMMENT='maintain users of the customers for loging into control pane';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr.','Admin','admin','*4ACFE3202A5FF5CF467898FC58AAB1D615029441','guyfromchennai@gmail.com','9003013383','2014-09-28',1,NULL,0,'A','E','::1'),(2,'Mr.','Kumar','kumar','*ED827A5B0E3FDE1D816566BDEDA8599CE29B3C3A','sundaramkumar73@gmail.com','9003013383','2014-12-05',1,NULL,0,'U','E','::1');
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

-- Dump completed on 2014-12-05 16:52:01
