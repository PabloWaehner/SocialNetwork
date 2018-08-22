DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    status VARCHAR (10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- updated_at TIMESTAMP
);




--
--
-- UPDATE friendships
-- SET status = 2, updated_at = CURRENT_TIMESTAMP
--
--
