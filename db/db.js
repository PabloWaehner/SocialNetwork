const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(
        "postgres:pablomartinwaehner:password@localhost:5432/socialnetwork"
    );
}

exports.getUsers = function() {
    return db.query("SELECT * FROM users;").then(results => {
        // console.log("getUsers: ", results.rows);
        return results.rows;
    });
};

exports.register = function(firstName, lastName, email, password) {
    const q = `INSERT INTO users (first_name, last_name, email, hashed_password )
    VALUES($1, $2, $3, $4)
    RETURNING *`;

    const params = [firstName, lastName, email, password];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.updateUserImage = function(userID, image) {
    const params = [userID, image];
    const q = `
        UPDATE users SET
        image = $2
        WHERE id = $1
        RETURNING *;
        `;
    return db.query(q, params).then(results => {
        return results.rows[0].image;
    });
};

exports.getUserById = function(id) {
    const params = [id];
    return db
        .query(`SELECT * FROM users WHERE id= $1;`, params)
        .then(results => {
            return results.rows[0];
        });
};

exports.addBio = function(userID, bio) {
    const q = `
    UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING *
    `;
    const params = [userID, bio];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getFriendshipStatus = function(userID, friendID) {
    const q = `SELECT * FROM friendships WHERE ((receiver_id = $1 AND sender_id = $2) OR ( receiver_id = $2 AND sender_id = $1));`;
    const params = [userID, friendID];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.pendingFriend = function(userID, friendID) {
    const params = [userID, friendID];
    const q = `INSERT INTO friendships (sender_id, receiver_id, status) VALUES ($1, $2, 'pending');`;
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.cancelRequest = function(userID, friendID) {
    const params = [userID, friendID];
    const q = `DELETE FROM friendships WHERE ((sender_id = $1 AND receiver_id = $2)
    OR (sender_id = $2 AND receiver_id = $1));`;
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
exports.acceptFriend = function(senderId, receiverId) {
    const params = [senderId, receiverId];
    const q = `
       UPDATE friendships
       SET status = 'friends'
       WHERE ((sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1));
       `;
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.listOfFriends = function(userId) {
    console.log("listOfFriends in db");
    const params = [userId];
    const q = `
           SELECT users.id, first_name, last_name, image, status
           FROM friendships
           JOIN users
           ON (status = 'pending' AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 'friends' AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 'friends' AND sender_id = $1 AND receiver_id = users.id)
       `;
    return db.query(q, params).then(results => {
        return results.rows;
    });
};
//
exports.getUsersByIds = function(arrayOfIds) {
    const q = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(q, [arrayOfIds]).then(results => {
        return results.rows;
    });
};
//

// exports.joinById = function(userId) {
//     const q = `SELECT * FROM users WHERE id = $1`;
//     return db.query(q, [userId]).then(results => {
//         return results.rows[0];
//     });
// };

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.checkPassword = function(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
