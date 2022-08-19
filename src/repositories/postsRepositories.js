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

async function getTimelinePosts(limit, offset) {
    const defaultQueryString = `
        select p.id as "postId", p.text, p.url, count(distinct pl.user_id) as "likesCount",
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
        group by p.id
        order by p.created_at desc
    `;

    if(limit && offset) {
        return connection.query(`
            ${defaultQueryString}
            limit $1
            offset $2
        `, [limit, offset]);
    };

    if(limit) {
        return connection.query(`
            ${defaultQueryString}
            limit $1
        `, [limit]);
    };

    if(offset) {
        return connection.query(`
            ${defaultQueryString}
            offset $1
        `, [offset]);
    };

    limit = 20;
    return connection.query(`
        ${defaultQueryString}
        limit $1
    `, [limit]);
}

async function updatePostText(text, postId) {
    connection.query(`
        update posts
        set text=$1
        where id=$2;
    `, [text, postId]);
};

async function getPostHashtagIds(postId) {
    return connection.query(`
        select hashtag_id as "hashtagId"
        from post_hashtags
        where post_id=$1
        order by hashtag_id;
    `, [postId]);
};

async function getPostById(postId) {
    return connection.query(`
        select *
        from posts p
        where p.id=$1;
    `, [postId]);
};

async function deletePostHashtagsRegisters(postId) {
    connection.query(`
        delete from post_hashtags
        where post_id=$1;
    `, [postId]);
};

async function deletePostLikesRegisters(postId) {
    connection.query(`
        delete from post_likes
        where post_id=$1;
    `, [postId]);
};

async function deletePostById(postId) {
    connection.query(`
        delete from posts
        where id=$1;
    `, [postId]);
};

async function likePost(userId, postId) {
    connection.query(`
        insert into post_likes (user_id, post_id)
        values ($1, $2);
    `, [userId, postId]);
};

const postsRepository = {
    createPost,
    getUserLastPostId,
    createPostHashtags,
    getTimelinePosts,
    updatePostText,
    getPostHashtagIds,
    getPostById,
    deletePostHashtagsRegisters,
    deletePostLikesRegisters,
    deletePostById,
    likePost
};

export default postsRepository;