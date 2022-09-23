ALTER TABLE user_player
    RENAME TO player;

ALTER TABLE player
    RENAME COLUMN user_role TO player_role;

ALTER TABLE player
    RENAME CONSTRAINT fk_game_user_player TO fk_game_player;

ALTER TABLE payment
    RENAME CONSTRAINT fk_payment_from_user TO fk_payment_from_player;

ALTER TABLE payment
    RENAME CONSTRAINT fk_payment_to_user TO fk_payment_to_player;

ALTER TABLE payment
    RENAME COLUMN requester_user_player_id TO requester_player_id;

ALTER TABLE payment
    RENAME COLUMN from_user_player_id TO from_player_id;

ALTER TABLE payment
    RENAME COLUMN to_user_player_id TO to_player_id;

ALTER TABLE payment
    RENAME CONSTRAINT fk_payment_requester_user TO fk_payment_requester_player;
