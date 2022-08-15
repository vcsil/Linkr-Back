/* eslint-disable no-use-before-define */
import hashtagRepository from "../repositories/hashtagRepositories.js";
import postsRepository from "../repositories/postsRepositories.js";

function getHashtagsIdsFromArrayOfQueries(arrayOfQueries) {
    // Ta mandando um array de undefined
    const hashtagsIds = [];

    arrayOfQueries.forEach((array) => {
        const { rows: id } = array;

        hashtagsIds.push(id[0].id);
    });

    return hashtagsIds;
}

export async function createPost(req, res) {
    const { url, text } = req.body;
    const userId = res.locals.user.id;

    try {
        // Preenchendo tabela post
        await postsRepository.createPost(userId, url, text);

        // Preenchendo tabala post_hashtags e salvando as hashtags novas
        if (text) {
            const { arrayHashtagsToRegister, arrayHashtags } = res.locals;

            if (arrayHashtags) {
                if (arrayHashtagsToRegister.length !== 0) {
                    // Adicionando hashtags novas na tabela de hashtags
                    await Promise.all(
                        arrayHashtagsToRegister.forEach(async (hashtag) => {
                            await hashtagRepository.createHashtag(hashtag);
                        })
                    );
                }

                const queriesResults = await Promise.all(
                    arrayHashtags.map((hashtag) =>
                        hashtagRepository.getHashtagIdByName(hashtag)
                    )
                );
                // Array de ids das hashtags usadas
                const hashtagIds =
                    getHashtagsIdsFromArrayOfQueries(queriesResults);

                // Pegando o id do post
                const { rows: postIdQuery } =
                    await postsRepository.getUserLastPostId(userId);
                const postId = postIdQuery[0].id;

                // Preenchendo tabela de post_hashtags
                // ERRO AQUI <<<<<<<<<<<<<<<<
                await Promise.all(
                    hashtagIds.forEach((hashtagId) =>
                        postsRepository.createPostHashtags(postId, hashtagId)
                    )
                );
            }
        }

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function timeline(req, res) {
    try {
        const posts = await postsRepository.showPosts();
        return res.send(posts.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
