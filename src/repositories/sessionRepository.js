import connection from "../db.js";

async function createSession(userId, token) {
    return connection.query(
        `INSERT INTO sessions ("user_id", token)
         VALUES ($1, $2)`,
        [userId, token]
    );
}

const sessionRepository = {
    createSession,
};

export default sessionRepository;
