CREATE TABLE game (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    code VARCHAR(25) NOT NULL UNIQUE,
    is_collect_from_free_parking BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE player (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(25) NOT NULL UNIQUE,
    money_balance BIGINT NOT NULL,
    player_role VARCHAR(25) NOT NULL,
    game_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE player
    ADD CONSTRAINT fk_game_player FOREIGN KEY (game_id) REFERENCES game;

CREATE TABLE money_sink (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    sink_name varchar(100) NOT NULL,
    money_balance BIGINT NOT NULL,
    is_bank BOOLEAN NOT NULL,
    game_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE money_sink
    ADD CONSTRAINT fk_game_money_sink FOREIGN KEY (game_id) REFERENCES game;

CREATE TABLE payment (
     pay_request_uuid VARCHAR(100) NOT NULL,
     is_from_sink BOOLEAN NOT NULL,
     is_to_sink BOOLEAN NOT NULL,
     amount_paid BIGINT NOT NULL,
     from_player_id BIGINT NULL,
     from_money_sink_id BIGINT NULL,
     to_player_id BIGINT NULL,
     to_money_sink_id BIGINT NULL,
     requester_player_id BIGINT NOT NULL,
     game_id BIGINT NOT NULL,
     PRIMARY KEY (pay_request_uuid)
);

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_from_player FOREIGN KEY (from_player_id) REFERENCES player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_to_player FOREIGN KEY (to_player_id) REFERENCES player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_from_money_sink FOREIGN KEY (from_money_sink_id) REFERENCES money_sink;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_to_money_sink FOREIGN KEY (to_money_sink_id) REFERENCES money_sink;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_requester_player FOREIGN KEY (requester_player_id) REFERENCES player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_game FOREIGN KEY (game_id) REFERENCES game;

CREATE TABLE user_role (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_record (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(300) NOT NULL UNIQUE,
    password VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE player
    ADD CONSTRAINT fk_user_player FOREIGN KEY (user_id) REFERENCES user_record;

CREATE TABLE user_user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

ALTER TABLE user_user_roles
    ADD CONSTRAINT fk_user_record_user_user_roles FOREIGN KEY (user_id) REFERENCES user_record;

ALTER TABLE user_user_roles
    ADD CONSTRAINT fk_user_role_user_user_roles FOREIGN KEY (role_id) REFERENCES user_role;
