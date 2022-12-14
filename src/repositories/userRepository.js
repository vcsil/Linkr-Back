import connection from "../db/db.js";

async function getTrendingHashtags() {
    return connection.query(`
        select h.id, h.name as hashtag
        from hashtags h
        join post_hashtags p
        on h.id=p.hashtag_id
        group by h.id
        order by count(p.post_id) desc
        limit 10;
    `);
};

async function getHashtagPosts(hashtag) {
    return connection.query(`
        select p.id, p.text, p.url, count(pl.post_id) as "likesCount",
            (
                select jsonb_build_object('id', u.id, 'authorName', u.username, 'authorImgUrl', u.profile_img_url)
                from users u
                where p.user_id=u.id
            ) as "authorInfo",
            array(
                select jsonb_build_object('id', h.id, 'name', h.name)
                from hashtags h 
                join post_hashtags ph
                on ph.hashtag_id=h.id
                where post_id=p.id
            ) as "hashtags",
            coalesce(
                jsonb_agg(
                    jsonb_build_object('id', u.id, 'name', u.username)
                ) filter (where u.id is not null), '[]'
            ) as "likedBy"
        from post_hashtags ph
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
};

async function getUserByEmail(email) {
    return connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

async function createUser(username, email, passwordHash, profile_img_url) {
    return connection.query(
        `INSERT INTO users (username, email, password, profile_img_url) 
         VALUES ($1, $2, $3, $4)`,
        [username, email, passwordHash, profile_img_url]
    );
};

async function getUserById(id) {
    return connection.query(`SELECT * FROM users WHERE id = $1;`, [id]);
};

async function getUserInfo(userId) {
    return connection.query(`
        select u.id, u.username, u.profile_img_url as "profileImageUrl"
        from users u
        where u.id=$1;
    `, [userId]); 
};

async function getUserPosts(userId) {
    return connection.query(`
    select p.id, p.text, p.url, count(distinct pl.user_id) as "likesCount",
        (
            select jsonb_build_object('id', u.id, 'authorName', u.username, 'authorImgUrl', u.profile_img_url)
            from users u
            where p.user_id=u.id
        ) as "authorInfo",
        array(
            select jsonb_build_object('id', h.id, 'name', h.name)
            from hashtags h
            join post_hashtags ph
            on ph.hashtag_id=h.id
            where post_id=p.id
            ) as "hashtags",
        coalesce(
            jsonb_agg(
                distinct jsonb_build_object('id', u.id, 'name', u.username)
                ) filter (where u.id is not null), '[]'
            ) as "likedBy"
    from posts p
    left join post_hashtags ph
    on p.id=ph.post_id
    left join hashtags h
    on h.id=ph.hashtag_id
    left join post_likes pl
    on pl.post_id=p.id
    left join users u
    on u.id=pl.user_id
    where p.user_id=$1
    group by p.id
    order by p.id;
`, [userId]);
};

const userRepository = {
    getTrendingHashtags,
    getHashtagPosts,
    getUserInfo,
    getUserPosts,
    getUserByEmail,
    createUser,
    getUserById
};

export default userRepository;

