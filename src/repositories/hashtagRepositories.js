import connection from "../db/db.js";

function getHashtags(hashtag) {
    return connection.query(
        `select name
         from hashtags
         where name=$1;`,
        [hashtag.toLowerCase()]
    );
}

async function createHashtag(hashtag) {
    connection.query(
        `insert into hashtags (name)
        values ($1);`,
        [hashtag]
    );
}

async function getHashtagIdByName(hashtag) {
    return connection.query(`
        select id
        from hashtags
        where name=$1
        order by id;
    `, [hashtag]);
}

async function deleteHashtagFromPostHashtagsTable(hashtagId, postId) {
    connection.query(`
        delete from post_hashtags
        where hashtag_id=$1
        and post_id=$2;
    `, [hashtagId, postId]);
};

const hashtagRepository = {
    getHashtags,
    createHashtag,
    getHashtagIdByName,
    deleteHashtagFromPostHashtagsTable
};

export default hashtagRepository;
