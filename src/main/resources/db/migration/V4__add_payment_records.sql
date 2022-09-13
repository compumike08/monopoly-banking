CREATE TABLE payment (
    pay_request_uuid VARCHAR(100) NOT NULL,
    is_from_sink BOOLEAN NOT NULL,
    is_to_sink BOOLEAN NOT NULL,
    amount_paid BIGINT NOT NULL,
    from_user_player_id BIGINT NULL,
    from_money_sink_id BIGINT NULL,
    to_user_player_id BIGINT NULL,
    to_money_sink_id BIGINT NULL,
    requester_user_player_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    PRIMARY KEY (pay_request_uuid)
);

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_from_user FOREIGN KEY (from_user_player_id) REFERENCES user_player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_to_user FOREIGN KEY (to_user_player_id) REFERENCES user_player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_from_money_sink FOREIGN KEY (from_money_sink_id) REFERENCES money_sink;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_to_money_sink FOREIGN KEY (to_money_sink_id) REFERENCES money_sink;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_requester_user FOREIGN KEY (requester_user_player_id) REFERENCES user_player;

ALTER TABLE payment
    ADD CONSTRAINT fk_payment_game FOREIGN KEY (game_id) REFERENCES game;
