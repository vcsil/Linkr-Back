import hashtagRepository from "../repositories/hashtagRepositories.js";
import extractHashtags from "../utils/extractHashtags.js";

function getHashtagNamesFromArrayOfQueries(arrayOfQueries) {
    // Filtra o array de query e retorna um array com so nomes das hashtags
    const hashtagNames = [];

    arrayOfQueries.forEach((array) => {
        const { rows: hashtag, rowCount: hashtagCount } = array;

        if (hashtagCount !== 0) {
            hashtagNames.push(hashtag[0].name);
        }
    });

    return hashtagNames;
}

export default async function validateHashtag(req, res, next) {
    const { text } = req.body;

    if (text) {
        const hashtags = extractHashtags(text); // Array de hashtags no texto

        if (hashtags.length !== 0) {
            const queriesResult = await Promise.all(
                hashtags.map((hashtag) =>
                    hashtagRepository.getHashtags(hashtag)
                )
            );
            const hashtagsRegistered =
                getHashtagNamesFromArrayOfQueries(queriesResult);
            const hashtagsToRegister = hashtags.filter(
                (hashtag) => !hashtagsRegistered.includes(hashtag)
            );

            res.locals.arrayHashtagsToRegister = hashtagsToRegister;
            res.locals.arrayHashtags = hashtags;
            next();
        }
    }

    next();
}
