CREATE TABLE property_claim (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    game_id BIGINT NOT NULL,
    owned_by_player_id BIGINT,
    property_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE property_claim
    ADD CONSTRAINT fk_property_claim_game FOREIGN KEY (game_id) REFERENCES game;

ALTER TABLE property_claim
    ADD CONSTRAINT fk_property_claim_player FOREIGN KEY (owned_by_player_id) REFERENCES player;

ALTER TABLE property_claim
    ADD CONSTRAINT fk_property_claim_property FOREIGN KEY (property_id) REFERENCES property;
