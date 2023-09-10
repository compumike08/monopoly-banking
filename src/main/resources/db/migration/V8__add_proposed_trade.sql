CREATE TABLE proposed_trade (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    game_id BIGINT NOT NULL,
    proposing_player_id BIGINT NOT NULL,
    requsted_player_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE proposed_trade
    ADD CONSTRAINT fk_proposed_trade_game FOREIGN KEY (game_id) REFERENCES game;

ALTER TABLE proposed_trade
    ADD CONSTRAINT fk_proposed_trade_proposing_player FOREIGN KEY (proposing_player_id) REFERENCES player;

ALTER TABLE proposed_trade
    ADD CONSTRAINT fk_proposed_trade_requested_player FOREIGN KEY (requsted_player_id) REFERENCES player;

ALTER TABLE property_claim
    ADD offered_in_proposed_trade_id BIGINT;

ALTER TABLE property_claim
    ADD requested_in_proposed_trade_id BIGINT;

ALTER TABLE property_claim
    ADD CONSTRAINT fk_property_claim_offered_in_proposed_trade FOREIGN KEY (offered_in_proposed_trade_id) REFERENCES proposed_trade;

ALTER TABLE property_claim
    ADD CONSTRAINT fk_property_claim_requested_in_proposed_trade FOREIGN KEY (requested_in_proposed_trade_id) REFERENCES proposed_trade;
