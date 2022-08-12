import connection from "../db/db.js";

async function getTrendingHashtags() {
    return connection.query(`
        select h.id, h.name as hashtag
        from hashtags h
        join posts_hashtags p
        on h.id=p.hashtag_id
        group by h.id
        config_database
        order by count(p.post_id) desc
        limit 10;
    `);
}

async function getHashtagPosts(hashtag) {
    return connection.query(
        `
        select p.id, p.message, p.url, count(pl.post_id) as "likesCount",
            array(
                select jsonb_build_object('id', h.id, 'name', h.name)
                from hashtags h 
                join posts_hashtags ph
                on ph.hashtag_id=h.id
                where post_id=p.id
            ) as "hashtags",
            coalesce(
                jsonb_agg(
                    json_build_object('id', u.id, 'name', u.username)
                ) filter (where u.id is not null), '[]'
            ) as "likedBy"
        from posts_hashtags ph
        left join posts p
        on p.id=ph.post_id
        left join hashtags h
        on h.id=ph.hashtag_id
        left join post_likes pl
        on pl.post_id=p.id
        left join users u 
        on u.id=pl.user_id
        where h.name=$1
        group by p.id
        order by p.id;
    `,
        [hashtag]
    );
}

async function getUserByEmail(email) {
    return connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

async function createUser(username, email, passwordHash, profile_img_url) {
    return connection.query(
        `INSERT INTO users (username, email, password, profile_img_url) 
         VALUES ($1, $2, $3, $4)`,
        [username, email, passwordHash, profile_img_url]
    );
}

async function getUserById(id) {
    return connection.query(`SELECT * FROM users WHERE id = $1;`, [id]);
}

const userRepository = {
    getTrendingHashtags,
    getHashtagPosts,
    getUserByEmail,
    createUser,
    getUserById,
};

export default userRepository;
