CREATE TABLE game(
  game_id int AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE user(
  user_id int AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  code VARCHAR(250),
  money_balance int NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  game_id int NOT NULL,
  FOREIGN KEY (game_id) REFERENCES game(game_id)
);

CREATE TABLE money_sink(
  sink_id int AUTO_INCREMENT PRIMARY KEY,
  sink_name VARCHAR(250) NOT NULL,
  money_balance int NOT NULL,
  game_id int NOT NULL,
  FOREIGN KEY (game_id) REFERENCES game(game_id)
);
