import connection from "../db/db.js";
import extractHashtags from "../utils/extractHashtags.js";

export default async function validateHashtag(req, res, next) {
    const { text } = req.body;

    if(text) {
        const hashtags = extractHashtags(text);

        if(hashtags.length !== 0) {
            const arrayEx = [];

            await hashtags.forEach(async hashtag => {
                const { rows: hashtagRegistered, rowCount: hashtagCount } = await getHashtags(hashtag);

                if(hashtagCount !== 0) {
                    arrayEx.push(hashtagRegistered[0].name);
                    console.log(arrayEx);
                }
            });

            res.locals.arrayEx = arrayEx;
            next();

            // return res.send(arrayEx);
            // const hashtagsToRegister = hashtags.filter(hashtag => !(hashtagsRegistered.includes(hashtag.toLowerCase())));
            
            

            
            // res.locals.hashtagsToRegister = hashtagsToRegister;
            // next();
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
