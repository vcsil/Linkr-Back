import connection from "../db.js";

async function createSession(userId, token) {
    return connection.query(
        `INSERT INTO sessions ("user_id", token)
         VALUES ($1, $2)`,
        [userId, token]
    );
}

async function getSessionByToken(token) {
    return connection.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
}

async function deleteSession(sessionId) {
    return connection.query(`DELETE FROM sessions WHERE id=$1`, [sessionId]);
}

const sessionRepository = {
    createSession,
    getSessionByToken,
    deleteSession,
};

export default sessionRepository;
