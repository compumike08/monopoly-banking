CREATE TABLE game (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    code VARCHAR(25) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE user_player (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(25) NOT NULL UNIQUE,
    money_balance INT4 NOT NULL,
    user_role VARCHAR(25) NOT NULL,
    game_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE user_player
    ADD CONSTRAINT fk_game_user_player FOREIGN KEY (game_id) REFERENCES game;

CREATE TABLE money_sink (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    sink_name varchar(100) NOT NULL,
    money_balance INT4 NOT NULL,
    is_bank BOOLEAN NOT NULL,
    game_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE money_sink
    ADD CONSTRAINT fk_game_money_sink FOREIGN KEY (game_id) REFERENCES game;
