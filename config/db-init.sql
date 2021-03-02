USE stackoverflow_clone;

CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    location VARCHAR(50),
    title VARCHAR(10) NOT NULL,
    website_link VARCHAR(20),
    twitter_username VARCHAR(20),
    github_username VARCHAR(20),
    timestamp_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timestamp_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(30) NOT NULL,
    body TEXT NOT NULL,
    timestamp_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timestamp_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    body TEXT NOT NULL,
    timestamp_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timestamp_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (question_id) REFERENCES Question(id)
);

CREATE TABLE IF NOT EXISTS Subscription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (question_id) REFERENCES Question(id)
);

CREATE TABLE IF NOT EXISTS Vote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    answer_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (answer_id) REFERENCES Answer(id)
);



INSERT INTO `user` VALUES (1,'swissvic','Victor','Abidoye','victortemitope95@gmail.com','$2b$12$sP.ae0xxUvSRgtmGm0mFz..bCaFu/6rsvkq0UIEu5p0lPm2hMmAqC','Nigeria','Mr',NULL,NULL,NULL,'2021-02-27 17:37:00','2021-02-27 17:37:00'),
(2,'beski','Ajayi','Abidoye','abc@gmail.com','$2b$12$AMUeuMFGtxZS5EmWb.JRy.yOkijconkYN//5n0BCSg0OJuHpfNLiK','Nissgeria','Mr',NULL,NULL,NULL,'2021-02-27 19:38:39','2021-03-01 07:12:42'),
(3,'swissvic','Victor','Abidoye','akbc@gmail.com','$2b$10$uWjBXnbFrPExD9HnStiCyOFBn/vlbPtHDbqi5Hn8UAoVY2P0D0SRy','Nigeria','Mr',NULL,NULL,NULL,'2021-02-27 21:03:37','2021-02-27 21:03:37'),
(4,'swissvic','Victor','Abidoye','akbcdd@gmail.com','$2b$12$VwUybtRGGgdT7ghqE4brluVcD9e.Cxa36hh1U4KS2w.7u8RwWC2t6','Nigeria','Mr',NULL,NULL,NULL,'2021-02-28 16:07:05','2021-02-28 16:07:05'),
(5,'swissvic','Victor','Abidoye','victortemitopwe95@gmail.com','$2b$12$RSu3dVzrqBszZKNPCBKkt.2aK/YyApZeF4Po4gutPKJqngSaCj1rK','Nigeria','Mr',NULL,NULL,NULL,'2021-03-01 01:23:37','2021-03-01 01:23:37'),
(6,'Freda.Marvin89','Paige','Upton','Enoch_Walter@yahoo.com','HaXoE1Rng_B3qik','Borders','aut','http://nickolas.name','Sallie_Koss62','Orlo.Bechtelar66','2021-03-01 18:29:18','2021-03-01 18:29:18'),
(7,'Carlotta19','Craig','Kulas','Magdalen.Heller@gmail.com','n5VR_PCDnDMiLje','Borders','quo','https://davin.net','Dudley_Ferry','Lexus_Hilpert59','2021-03-01 18:29:18','2021-03-01 18:29:18'),
(8,'Armand_Abernathy71','Katherine','DuBuque','Lauretta26@hotmail.com','qx5sAZKgLrA8cWW','Borders','qui','http://aletha.name','Ashly58','Noah76','2021-03-01 21:59:23','2021-03-01 21:59:23'),
(9,'Elfrieda30','Dominic','Gibson','Jaylan.Bruen54@yahoo.com','rO6QzmjTDfHpzHD','Buckinghamshire','qui','https://clyde.biz','Misael_Ratke','Elenora_Cummings29','2021-03-01 21:59:23','2021-03-01 21:59:23'),
(10,'Keyon55','Lacey','Walter','Providenci_Will37@gmail.com','n_95yf0pLDWqQx3','Borders','cum','http://gillian.name','Natasha_Pollich53','Tristian_Paucek80','2021-03-02 07:16:04','2021-03-02 07:16:04'),
(11,'Fabian_Braun20','Lilla','O\'Hara','Catalina.Quigley@gmail.com','vCfpLXl9nvZn4Bw','Berkshire','est','http://anita.biz','Jacques.Herzog','Velda.Ratke','2021-03-02 07:16:04','2021-03-02 07:16:04'),
(12,'jideobiGlobal','Jide','Obi','jideobi@gmail.com','$2b$12$ApJTDugEHTHc1L9YzjFbXOiJL2qfOwZMPBprAx1QcfO5VLt2Uhip2','Nissgeria','Mr','','','','2021-03-02 11:47:55','2021-03-02 12:11:33'),
(13,'vikky','Jide','Obi','victorabidoyeng@gmail.com','$2b$12$lDWEHJdWBvKoBvUua73Vfu8V98LzfWOX.YCX8iWM17XdWcwhfSa5K','Nigeria','Mr',NULL,NULL,NULL,'2021-03-02 17:13:27','2021-03-02 17:13:27');


INSERT INTO `question` VALUES (1,1,'Lorem Ipsum','Lorem Ipsum','2021-02-28 00:39:30','2021-02-28 00:39:30'),
(2,2,'Lorem Ipsum','Lorem Ipsum','2021-02-28 00:40:00','2021-02-28 00:40:00'),
(3,2,'Lorem Ipsum','Lorem Ipsum','2021-02-28 00:42:41','2021-02-28 00:42:41'),
(4,1,'Lorem Ipsum','Lorem Ipsum','2021-03-01 07:15:07','2021-03-01 07:15:07'),
(5,12,'Lorem Ipsum','Lorem Ipsum','2021-03-02 13:09:38','2021-03-02 13:09:38');

INSERT INTO `answer` VALUES (1,1,2,'Lorem','2021-02-28 06:36:51','2021-02-28 06:36:51'),
(2,1,2,'Lorem','2021-02-28 06:37:05','2021-02-28 06:37:05'),
(3,1,2,'Lorem','2021-02-28 06:37:08','2021-02-28 06:37:08'),
(4,1,2,'Lorem','2021-03-01 07:28:47','2021-03-01 07:28:47'),
(5,1,2,'Lorem','2021-03-01 08:45:25','2021-03-01 08:45:25'),
(6,1,3,'Lorem','2021-03-01 08:51:19','2021-03-01 08:51:19'),
(7,1,3,'Lorem','2021-03-01 08:58:09','2021-03-01 08:58:09'),
(8,5,12,'Lorem','2021-03-02 16:18:44','2021-03-02 16:18:44'),
(9,2,12,'Lorem','2021-03-02 17:12:39','2021-03-02 17:12:39'),
(10,1,12,'Lorem','2021-03-02 17:14:03','2021-03-02 17:14:03');

INSERT INTO `vote` VALUES (1,1,1,'DOWNVOTE'),(2,1,2,'DOWNVOTE'),(3,1,1,'DOWNVOTE'),(4,1,3,'DOWNVOTE'),(5,2,3,'UPVOTE'),(6,8,12,'DOWNVOTE');

INSERT INTO `subscription` VALUES (1,1,1,'ACTIVATE'),
(2,1,1,'ACTIVATE'),(3,1,2,'ACTIVATE'),
(4,1,3,'ACTIVATED'),(5,1,12,'ACTIVATED'),
(6,1,13,'ACTIVATED');