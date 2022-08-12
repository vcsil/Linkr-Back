import connection from "../db/db.js";

async function createPosts(userId, url, text) {
    return connection.query(
        `INSERT INTO posts (userId, url, text) VALUES($1, $2, $3)`,
        [userId, url, text]
    );
}

async function showPosts() {
    return connection.query(
        `SELECT u.username,p.text,p.url,u."imgUrl" FROM posts p 
        JOIN users u 
        ON u.id = p.userid 
        ORDER BY p."createdAt" desc LIMIT 20`
    );
}

const postsRepository = {
    createPosts,
    showPosts,
};

export default postsRepository;
