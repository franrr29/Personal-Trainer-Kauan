CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role ENUM('trainer', 'student') NOT NULL DEFAULT 'student',
  status ENUM('pending', 'active') NOT NULL DEFAULT 'pending',
  plan VARCHAR(50) NULL,
  avatar VARCHAR(300) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trainer_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  features TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_value INT NOT NULL DEFAULT 1,
  duration_unit ENUM('days', 'weeks', 'months', 'years') NOT NULL DEFAULT 'months',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trainer_id) REFERENCES users(id)
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  plan VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mp_payment_id VARCHAR(100) NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trainer_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  type ENUM('payment') DEFAULT 'payment',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trainer_id) REFERENCES users(id)
);


CREATE TABLE exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trainer_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  video_url VARCHAR(500) NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trainer_id) REFERENCES users(id)
);

CREATE TABLE routines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trainer_id INT NOT NULL,
  student_id INT NOT NULL,
  day ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo') NOT NULL,
  title VARCHAR(150) NOT NULL,
  trainer_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trainer_id) REFERENCES users(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE routine_exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  routine_id INT NOT NULL,
  exercise_id INT NOT NULL,
  sets INT NOT NULL,
  reps INT NOT NULL,
  rest_seconds INT NOT NULL,
  notes TEXT NULL,
  exercise_order INT NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);