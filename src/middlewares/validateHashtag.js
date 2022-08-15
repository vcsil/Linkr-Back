import connection from "../db/db.js";
import extractHashtags from "../utils/extractHashtags.js";

export default async function validateHashtag(req, res, next) {
    const { text } = req.body;

    if(text) {
        const hashtags = extractHashtags(text);

        if(hashtags.length !== 0) {

            const queriesResult = await Promise.all(hashtags.map(async hashtag => await getHashtags(hashtag)));
            const hashtagsRegistered = getHashtagNamesFromArrayOfQueries(queriesResult);
            const hashtagsToRegister = hashtags.filter(hashtag => !hashtagsRegistered.includes(hashtag));

            res.locals.hashtagsToRegister = hashtagsToRegister;
            res.locals.hashtags = hashtags;
            next();
        };
    };

    next();
};

function getHashtags(hashtag) {
    return connection.query(`
            select name
            from hashtags
            where name=$1;
        `, [hashtag.toLowerCase()]);
};

function getHashtagNamesFromArrayOfQueries(array) {
    const hashtagNames = [];

    array.forEach(array => {
        const { rows: hashtag, rowCount: hashtagCount } = array;

        if(hashtagCount !== 0) {
            hashtagNames.push(hashtag[0].name);
        };
    });

    return hashtagNames;
};