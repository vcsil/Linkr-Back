import connection from "../db.js";

async function getTrendingHashtags() {
    return connection.query(`
        select h.id, h.name as hashtag
        from hashtags h
        join posts_hashtags p
        on h.id=p.hashtag_id
        group by h.id
        order by count(p.post_id) desc;
    `)
};

const userRepository = {
    getTrendingHashtags
};

export default userRepository;