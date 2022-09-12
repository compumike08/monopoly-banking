ALTER TABLE game
    ADD COLUMN is_collect_from_free_parking BOOLEAN NULL;

UPDATE game
    SET is_collect_from_free_parking = true;

ALTER TABLE game
    ALTER COLUMN is_collect_from_free_parking SET NOT NULL;
