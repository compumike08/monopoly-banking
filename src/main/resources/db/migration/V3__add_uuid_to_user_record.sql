ALTER TABLE user_record
    ADD user_uuid uuid NOT NULL UNIQUE default gen_random_uuid();
