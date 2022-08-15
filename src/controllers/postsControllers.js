import postsRepository from "../repositories/postsRepositories.js";


export async function createPost(req, res){
    const { url, text } = req.body;
    const userId = res.locals.user.id;
    
    try{
        await postsRepository.createPost(userId, url, text);

        if(text) {
            const { hashtagsToRegister, hashtags } = res.locals;

            if(hashtags) {

                if(hashtagsToRegister.length !== 0) {
                    await Promise.all(hashtagsToRegister.forEach(async hashtag => {
                        await postsRepository.createHashtag(hashtag);
                    }));
                };

                const queriesResults = await Promise.all(hashtags.map(async hashtag => {
                    await postsRepository.getHashtagIdByName(hashtag);
                }));

                const hashtagIds = getHashtagsIdsFromArrayOfQueries(queriesResults);

                const { rows: postIdQuery } = await postsRepository.getUserLastPostId(userId);

                const postId = postIdQuery[0].id;

                await Promise.all(hashtagIds.forEach(async hashtagId => {
                    await postsRepository.createPostHashtags(postId, hashtagId);
                }));
            };
        };

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function timeline(req, res){

    try{
        const posts = await postsRepository.showPosts()
        return res.send(posts.rows)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

function getHashtagsIdsFromArrayOfQueries(array) {
    const hashtagsIds = [];

    array.forEach(array => {
        const { rows: id } = array;

        hashtagsIds.push(id[0].id);
    });

    return hashtagsIds;
};