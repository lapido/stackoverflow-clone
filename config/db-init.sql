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

CREATE TABLE IF NOT EXISTS QuestionTag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    tag VARCHAR(20) NOT NULL,
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

CREATE TABLE IF NOT EXISTS Reaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    answer_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (answer_id) REFERENCES Answer(id)
);