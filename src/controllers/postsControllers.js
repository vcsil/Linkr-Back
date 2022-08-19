/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import urlMetadata from "url-metadata";
import hashtagRepository from "../repositories/hashtagRepositories.js";
import postsRepository from "../repositories/postsRepositories.js";
import sanitizeString from "../utils/sanitizeStrings.js";

function getHashtagsIdsFromArrayOfQueries(arrayOfQueries) {
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
                        arrayHashtagsToRegister.map((hashtag) => {
                            hashtagRepository.createHashtag(hashtag);
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
                await Promise.all(
                    hashtagIds.map((hashtagId) =>
                        postsRepository.createPostHashtags(postId, hashtagId)
                    )
                );
            }
        }

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function timelinePosts(req, res) {
    let limit = req.query.limit;
    let offset = req.query.offset;

    try {
        if(limit) {
            limit = sanitizeString(limit);

            if(isNaN(limit)) {
                return res.status(400).send("Limit is not in a valid format!");
            };
        };

        if(offset) {
            offset = sanitizeString(offset);

            if(isNaN(offset)) {
                return res.status(400).send("Offset is not in a valid format!");
            };
        };

        const { rows: posts } = await postsRepository.getTimelinePosts(limit, offset);

        for (const { url } of posts) {
            const metadata = await urlMetadata(url);
            const objetoMetadates = {
                url: metadata.canonical,
                title: metadata.title,
                image: metadata.image,
                description: metadata.description,
            };
            posts[index].objMeta = objetoMetadates;
            index++
        }

        return res.send(posts);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function updatePost(req, res) {
    const { postId } = req.params;
    const newText = req.body.text.trim();
    const { user, arrayHashtagsToRegister, arrayHashtags } = res.locals;

    if(isNaN(postId)) {
        return res.status(400).send("Please send a valid format for the post id!");
    };

    try {
        const { rows: postFound, rowCount: postCount } = await postsRepository.getPostById(postId);
        const postToUpdate = postFound[0];

        if(postCount === 0) {
            return res.status(404).send("There is no post with this id!");
        };

        if(user.id !== postToUpdate.user_id) {
            return res.sendStatus(401);
        };

        if(postToUpdate.text === newText) {
            return res.status(200).send("Post wasn't updated because new text is equal to text from original post!");
        };

        const { rows: queriePostHashtagIds } = await postsRepository.getPostHashtagIds(postId);
        const postHashtagIds = queriePostHashtagIds.map(hashtagIdOject => hashtagIdOject.hashtagId);

        if(arrayHashtags) {

            if (arrayHashtagsToRegister.length !== 0) {
                await Promise.all(
                    arrayHashtagsToRegister.map((hashtag) => {
                        hashtagRepository.createHashtag(hashtag);
                    })
                );
            }

            const queriesResults = await Promise.all(
                arrayHashtags.map((hashtag) =>
                   hashtagRepository.getHashtagIdByName(hashtag)
                )
            );

            const hashtagIds =
                getHashtagsIdsFromArrayOfQueries(queriesResults);


            if(postHashtagIds.length !== 0) {

                const originalPostHashtagIdsToDelete = postHashtagIds.filter(hashtagId => !hashtagIds.includes(hashtagId));
                const newHashtagsIds = hashtagIds.filter(hashtagId => !postHashtagIds.includes(hashtagId));

                if(originalPostHashtagIdsToDelete.length !== 0) {
                    await Promise.all(
                        originalPostHashtagIdsToDelete.map(hashtagId => {
                            hashtagRepository.deleteHashtagFromPostHashtagsTable(hashtagId, postId);
                        })
                    );
                };

                if(newHashtagsIds.length !== 0) {
                    await Promise.all(
                        newHashtagsIds.map(hashtagId => {
                            postsRepository.createPostHashtags(postId, hashtagId);
                        })
                    );
                };

            } else {

                await Promise.all(
                    hashtagIds.map((hashtagId) =>
                        postsRepository.createPostHashtags(postId, hashtagId)
                    )
                );
            };
        };

        await Promise.all(
            postHashtagIds.map((hashtagId) => {
                hashtagRepository.deleteHashtagFromPostHashtagsTable(hashtagId, postId);
            })
        );

        await postsRepository.updatePostText(newText, postId);

        return res.status(200).send("The post was successfully updated!");
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export async function deletePost(req, res) {
    const { user } = res.locals;
    const { postId } = req.params;

    if(isNaN(postId)) {
        return res.status(400).send("Please send a valid format for the post id!");
    };

    try {
        const { rows: queriePostToDelete, rowCount: postCount } = await postsRepository.getPostById(postId);
        const postToDelete = queriePostToDelete[0];

        if(postCount === 0) {
            return res.status(404).send("There is no post with this id!");
        };

        if(user.id !== postToDelete.user_id) {
            return res.sendStatus(401);
        };

        await postsRepository.deletePostHashtagsRegisters(postId);
        await postsRepository.deletePostLikesRegisters(postId);
        await postsRepository.deletePostById(postId);

        res.status(200).send("The post was deleted!");
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export async function likePost(req, res) {
    const { postId } = req.params;
    const { user } = res.locals;
    
    try {
        await postsRepository.likePost(user.id, postId);

        res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};