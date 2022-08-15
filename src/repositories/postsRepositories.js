import connection from "../db/db.js";

async function createPost(userId, url, text) {
    connection.query(
        `
        INSERT INTO posts (user_id, url, text) VALUES($1, $2, $3)
    `,
        [userId, url, text]
    );
}

async function getUserLastPostId(userId) {
    return connection.query(
        `select id
        from posts
        where user_id=$1
        order by created_at desc
        limit 1;`,
        [userId]
    );
}

async function createPostHashtags(postId, hashtagId) {
    connection.query(
        `insert into post_hashtags (post_id, hashtag_id)
        values ($1, $2);`,
        [postId, hashtagId]
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
    createPost,
    getUserLastPostId,
    createPostHashtags,
    showPosts,
};

export default postsRepository;
