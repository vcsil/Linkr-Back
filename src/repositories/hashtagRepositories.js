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
    return connection.query(`SELECT id FROM hashtags WHERE name=$1;`, [hashtag]);
}

const hashtagRepository = {
    getHashtags,
    createHashtag,
    getHashtagIdByName,
};

export default hashtagRepository;
