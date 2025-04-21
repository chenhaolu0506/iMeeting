-- MySQL dump 10.13  Distrib 8.0.29, for macos12 (x86_64)
--
-- Host: localhost    Database: imeeting
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `m_abnormal_info`
--

DROP TABLE IF EXISTS `m_abnormal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_abnormal_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img_url` varchar(255) DEFAULT NULL,
  `is_read` int NOT NULL,
  `meeting_id` int NOT NULL,
  `meeting_name` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `time` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_abnormal_info`
--

LOCK TABLES `m_abnormal_info` WRITE;
/*!40000 ALTER TABLE `m_abnormal_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_abnormal_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_coordinate_info`
--

DROP TABLE IF EXISTS `m_coordinate_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_coordinate_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `before_meeting_id` int DEFAULT NULL,
  `meeting_id` int DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_coordinate_info`
--

LOCK TABLES `m_coordinate_info` WRITE;
/*!40000 ALTER TABLE `m_coordinate_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_coordinate_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_equip`
--

DROP TABLE IF EXISTS `m_equip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_equip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_equip`
--

LOCK TABLES `m_equip` WRITE;
/*!40000 ALTER TABLE `m_equip` DISABLE KEYS */;
INSERT INTO `m_equip` VALUES (1,'智能锁',1);
/*!40000 ALTER TABLE `m_equip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_equip_repair_info`
--

DROP TABLE IF EXISTS `m_equip_repair_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_equip_repair_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equip_id` int NOT NULL,
  `damage_info` varchar(255) DEFAULT NULL,
  `meet_room_id` int NOT NULL,
  `repair_name` varchar(255) DEFAULT NULL,
  `repair_time` varchar(255) DEFAULT NULL,
  `report_time` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `tenant_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_equip_repair_info`
--

LOCK TABLES `m_equip_repair_info` WRITE;
/*!40000 ALTER TABLE `m_equip_repair_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_equip_repair_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_file_upload`
--

DROP TABLE IF EXISTS `m_file_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_file_upload` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `meet_room_id` int DEFAULT NULL,
  `meeting_id` int DEFAULT NULL,
  `status` int NOT NULL,
  `tenant_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtj0smrb83prqxeis9fyxk0khc` (`meeting_id`),
  KEY `FKn52j840859hshkro8vfs9wspu` (`meet_room_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_file_upload`
--

LOCK TABLES `m_file_upload` WRITE;
/*!40000 ALTER TABLE `m_file_upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_file_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_join_person`
--

DROP TABLE IF EXISTS `m_join_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_join_person` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int DEFAULT NULL,
  `sign_time` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_join_person`
--

LOCK TABLES `m_join_person` WRITE;
/*!40000 ALTER TABLE `m_join_person` DISABLE KEYS */;
INSERT INTO `m_join_person` VALUES (1,2,NULL,0,1),(2,3,NULL,0,1),(3,4,NULL,0,2),(4,4,NULL,0,1),(5,5,NULL,0,1),(6,5,NULL,0,2);
/*!40000 ALTER TABLE `m_join_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_leave_information`
--

DROP TABLE IF EXISTS `m_leave_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_leave_information` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_leave_information`
--

LOCK TABLES `m_leave_information` WRITE;
/*!40000 ALTER TABLE `m_leave_information` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_leave_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meeting`
--

DROP TABLE IF EXISTS `m_meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meeting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `begin` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `depart_id` int DEFAULT NULL,
  `last_time` int DEFAULT NULL,
  `meet_date` varchar(255) DEFAULT NULL,
  `meetroom_id` int DEFAULT NULL,
  `prepare_time` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpt2bx7bnctvup8ioeldqsosnn` (`depart_id`),
  KEY `FKr7e7bvt5lmsxr9yexs31ag1qv` (`meetroom_id`),
  KEY `FKc1toamo35efd0kf5qg0a8sm11` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meeting`
--

LOCK TABLES `m_meeting` WRITE;
/*!40000 ALTER TABLE `m_meeting` DISABLE KEYS */;
INSERT INTO `m_meeting` VALUES (2,'2022-07-17 10:15','sync up','2022-07-17 08:22:04',1,15,'2022-07-17',1,0,4,1,'敏捷开发例会',1,'2022-07-17 10:30'),(3,'2022-07-25 07:45','demo','2022-07-24 19:51:17',1,30,'2022-07-25',1,0,1,1,'公开课',1,'2022-07-25 08:15'),(4,'2022-09-10 09:00','项目实战，总体规划及实施','2022-09-10 06:05:05',1,120,'2022-09-10',1,60,1,1,'究极大项目实战',1,'2022-09-10 11:00'),(5,'2022-09-10 10:30','测试说明','2022-09-10 10:12:04',2,15,'2022-09-10',4,15,1,1,'测试标题',2,'2022-09-10 10:45');
/*!40000 ALTER TABLE `m_meeting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meeting_back`
--

DROP TABLE IF EXISTS `m_meeting_back`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meeting_back` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `meet_room_id` int NOT NULL,
  `time` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meeting_back`
--

LOCK TABLES `m_meeting_back` WRITE;
/*!40000 ALTER TABLE `m_meeting_back` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_meeting_back` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meeting_outline`
--

DROP TABLE IF EXISTS `m_meeting_outline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meeting_outline` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `level` int NOT NULL,
  `meeting_id` int NOT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meeting_outline`
--

LOCK TABLES `m_meeting_outline` WRITE;
/*!40000 ALTER TABLE `m_meeting_outline` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_meeting_outline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meeting_task`
--

DROP TABLE IF EXISTS `m_meeting_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meeting_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `meeting_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meeting_task`
--

LOCK TABLES `m_meeting_task` WRITE;
/*!40000 ALTER TABLE `m_meeting_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_meeting_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meeting_video`
--

DROP TABLE IF EXISTS `m_meeting_video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meeting_video` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_time` varchar(255) DEFAULT NULL,
  `create_user_id` int DEFAULT NULL,
  `status` int NOT NULL,
  `tenant_id` int NOT NULL,
  `video_room_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKojiou6dkt6jlyan975ux24jpl` (`create_user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meeting_video`
--

LOCK TABLES `m_meeting_video` WRITE;
/*!40000 ALTER TABLE `m_meeting_video` DISABLE KEYS */;
INSERT INTO `m_meeting_video` VALUES (1,'2022-07-15 20:41:55',1,2,1,'敏捷开发例会');
/*!40000 ALTER TABLE `m_meeting_video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meetroom`
--

DROP TABLE IF EXISTS `m_meetroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meetroom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qrcode_address` varchar(255) DEFAULT NULL,
  `avail_status` int DEFAULT NULL,
  `contain` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `now_status` int DEFAULT NULL,
  `num` varchar(255) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `wifi_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meetroom`
--

LOCK TABLES `m_meetroom` WRITE;
/*!40000 ALTER TABLE `m_meetroom` DISABLE KEYS */;
INSERT INTO `m_meetroom` VALUES (1,NULL,1,100,'盘古',0,'1','pangu',1,NULL),(4,NULL,1,100,'女娲',0,'02','nvwa',1,NULL);
/*!40000 ALTER TABLE `m_meetroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meetroom_depart`
--

DROP TABLE IF EXISTS `m_meetroom_depart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meetroom_depart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `depart_id` int DEFAULT NULL,
  `meetroom_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meetroom_depart`
--

LOCK TABLES `m_meetroom_depart` WRITE;
/*!40000 ALTER TABLE `m_meetroom_depart` DISABLE KEYS */;
INSERT INTO `m_meetroom_depart` VALUES (1,1,1,1),(2,0,2,1),(3,0,3,1),(4,0,4,1),(5,1,4,1);
/*!40000 ALTER TABLE `m_meetroom_depart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meetroom_equip`
--

DROP TABLE IF EXISTS `m_meetroom_equip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meetroom_equip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equip_id` int DEFAULT NULL,
  `meetroom_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhpgumo86xyphqhnx96o3lp22t` (`equip_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meetroom_equip`
--

LOCK TABLES `m_meetroom_equip` WRITE;
/*!40000 ALTER TABLE `m_meetroom_equip` DISABLE KEYS */;
INSERT INTO `m_meetroom_equip` VALUES (1,1,4);
/*!40000 ALTER TABLE `m_meetroom_equip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_meetroom_parameter`
--

DROP TABLE IF EXISTS `m_meetroom_parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_meetroom_parameter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `begin` varchar(255) DEFAULT NULL,
  `date_limit` int DEFAULT NULL,
  `over` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `time_interval` int DEFAULT NULL,
  `time_limit` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_meetroom_parameter`
--

LOCK TABLES `m_meetroom_parameter` WRITE;
/*!40000 ALTER TABLE `m_meetroom_parameter` DISABLE KEYS */;
INSERT INTO `m_meetroom_parameter` VALUES (1,'6:00',10,'18:00',1,1,2);
/*!40000 ALTER TABLE `m_meetroom_parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_my_file`
--

DROP TABLE IF EXISTS `m_my_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_my_file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `download_time` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_my_file`
--

LOCK TABLES `m_my_file` WRITE;
/*!40000 ALTER TABLE `m_my_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_my_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_open_apply`
--

DROP TABLE IF EXISTS `m_open_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_open_apply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `begin_date` varchar(255) DEFAULT NULL,
  `begin_time` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `meet_room_id` int DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `over_date` varchar(255) DEFAULT NULL,
  `over_time` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `tenant_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhjpx2ovu9q0awthlj6sc7dau` (`meet_room_id`),
  KEY `FKsmkndp5xfsejcajtmn9p97chi` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_open_apply`
--

LOCK TABLES `m_open_apply` WRITE;
/*!40000 ALTER TABLE `m_open_apply` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_open_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_outside_join_person`
--

DROP TABLE IF EXISTS `m_outside_join_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_outside_join_person` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_outside_join_person`
--

LOCK TABLES `m_outside_join_person` WRITE;
/*!40000 ALTER TABLE `m_outside_join_person` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_outside_join_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_video_right`
--

DROP TABLE IF EXISTS `m_video_right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_video_right` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_video_right`
--

LOCK TABLES `m_video_right` WRITE;
/*!40000 ALTER TABLE `m_video_right` DISABLE KEYS */;
INSERT INTO `m_video_right` VALUES (1,1,1);
/*!40000 ALTER TABLE `m_video_right` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_week_meeting`
--

DROP TABLE IF EXISTS `m_week_meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_week_meeting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `begin_time` varchar(255) DEFAULT NULL,
  `create_time` varchar(255) DEFAULT NULL,
  `depart_id` int DEFAULT NULL,
  `meet_begin` varchar(255) DEFAULT NULL,
  `meet_over` varchar(255) DEFAULT NULL,
  `meet_room_id` int DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `over_time` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `tenant_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `week` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4cac2x87pbooksr00u7nluwry` (`depart_id`),
  KEY `FK76m6m60ktvfi4ww2cg9ratvl4` (`meet_room_id`),
  KEY `FKt53uwf5c4kj1eefnlp7dyp06w` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_week_meeting`
--

LOCK TABLES `m_week_meeting` WRITE;
/*!40000 ALTER TABLE `m_week_meeting` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_week_meeting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant`
--

DROP TABLE IF EXISTS `tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `num` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant`
--

LOCK TABLES `tenant` WRITE;
/*!40000 ALTER TABLE `tenant` DISABLE KEYS */;
INSERT INTO `tenant` VALUES (1,'fullstack','1','fullstack','fullstack');
/*!40000 ALTER TABLE `tenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_depart`
--

DROP TABLE IF EXISTS `u_depart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_depart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_depart`
--

LOCK TABLES `u_depart` WRITE;
/*!40000 ALTER TABLE `u_depart` DISABLE KEYS */;
INSERT INTO `u_depart` VALUES (1,'技术研发',1),(2,'市场',1);
/*!40000 ALTER TABLE `u_depart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_face`
--

DROP TABLE IF EXISTS `u_face`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_face` (
  `id` int NOT NULL AUTO_INCREMENT,
  `face_address` varchar(255) DEFAULT NULL,
  `face_detail` tinyblob,
  `last_time` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_face`
--

LOCK TABLES `u_face` WRITE;
/*!40000 ALTER TABLE `u_face` DISABLE KEYS */;
/*!40000 ALTER TABLE `u_face` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_group`
--

DROP TABLE IF EXISTS `u_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_group`
--

LOCK TABLES `u_group` WRITE;
/*!40000 ALTER TABLE `u_group` DISABLE KEYS */;
INSERT INTO `u_group` VALUES (1,'核心研发组',1);
/*!40000 ALTER TABLE `u_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_group_record`
--

DROP TABLE IF EXISTS `u_group_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_group_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_group_record`
--

LOCK TABLES `u_group_record` WRITE;
/*!40000 ALTER TABLE `u_group_record` DISABLE KEYS */;
INSERT INTO `u_group_record` VALUES (1,1,1);
/*!40000 ALTER TABLE `u_group_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_menu_info`
--

DROP TABLE IF EXISTS `u_menu_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_menu_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(255) DEFAULT NULL,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_menu_info`
--

LOCK TABLES `u_menu_info` WRITE;
/*!40000 ALTER TABLE `u_menu_info` DISABLE KEYS */;
INSERT INTO `u_menu_info` VALUES (1,'参数管理',1),(2,'会议室管理',2),(3,'参数管理',0),(4,'人脸管理',4),(5,'会议管理',5),(6,'部门管理',6),(7,'角色管理',NULL),(8,'员工管理',8),(9,'设备管理',9),(10,'数据分析',1);
/*!40000 ALTER TABLE `u_menu_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_operator_blog`
--

DROP TABLE IF EXISTS `u_operator_blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_operator_blog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operate_content` varchar(255) DEFAULT NULL,
  `operate_time` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_operator_blog`
--

LOCK TABLES `u_operator_blog` WRITE;
/*!40000 ALTER TABLE `u_operator_blog` DISABLE KEYS */;
/*!40000 ALTER TABLE `u_operator_blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_position`
--

DROP TABLE IF EXISTS `u_position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_position` (
  `id` int NOT NULL AUTO_INCREMENT,
  `depart_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_position`
--

LOCK TABLES `u_position` WRITE;
/*!40000 ALTER TABLE `u_position` DISABLE KEYS */;
INSERT INTO `u_position` VALUES (1,1,'Sr.SDE',1);
/*!40000 ALTER TABLE `u_position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_push_message`
--

DROP TABLE IF EXISTS `u_push_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_push_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `receive_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_push_message`
--

LOCK TABLES `u_push_message` WRITE;
/*!40000 ALTER TABLE `u_push_message` DISABLE KEYS */;
INSERT INTO `u_push_message` VALUES (1,2,'您有一个新的会议，点击查看详情',1,0,'2022-07-17 08:22:04'),(2,3,'您有一个新的会议，点击查看详情',1,0,'2022-07-24 19:51:17'),(3,4,'您有一个新的会议，点击查看详情',2,0,'2022-09-10 06:05:05'),(4,4,'您有一个新的会议，点击查看详情',1,0,'2022-09-10 06:05:05'),(5,5,'您有一个新的会议，点击查看详情',1,0,'2022-09-10 10:12:04'),(6,NULL,'您有一个新的会议，点击查看详情',2,0,NULL);
/*!40000 ALTER TABLE `u_push_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_role_info`
--

DROP TABLE IF EXISTS `u_role_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_role_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_role_info`
--

LOCK TABLES `u_role_info` WRITE;
/*!40000 ALTER TABLE `u_role_info` DISABLE KEYS */;
INSERT INTO `u_role_info` VALUES (1,'普通角色',1),(2,'测试角色',1);
/*!40000 ALTER TABLE `u_role_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_role_menu`
--

DROP TABLE IF EXISTS `u_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_role_menu`
--

LOCK TABLES `u_role_menu` WRITE;
/*!40000 ALTER TABLE `u_role_menu` DISABLE KEYS */;
INSERT INTO `u_role_menu` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1),(7,7,1),(8,8,1),(9,9,1),(12,5,2),(13,10,1);
/*!40000 ALTER TABLE `u_role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `u_user_info`
--

DROP TABLE IF EXISTS `u_user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `u_user_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `depart_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `worknum` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u_user_info`
--

LOCK TABLES `u_user_info` WRITE;
/*!40000 ALTER TABLE `u_user_info` DISABLE KEYS */;
INSERT INTO `u_user_info` VALUES (1,1,'Pixels','$2a$10$5sknTokEHa.PfrMNnvzoX.2yfuBmFgv13YiFsKGvO0YbZqzINfYeS','1902388999',1,'id?',1,1,1,'cat','101'),(2,2,'test','$2a$10$sRCwrRFmNWm5QenW3OYTWupzIh6/Lac5jmCapCz9W4nBcJzFL98Vq','459812',1,NULL,2,1,1,'1—005','005');
/*!40000 ALTER TABLE `u_user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'imeeting'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-10 20:52:42
