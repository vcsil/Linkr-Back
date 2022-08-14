import { hash } from "bcrypt";
import postsRepository from "../repositories/postsRepositories.js";
import extractHashtags from "../utils/extractHashtags.js";


export async function createPost(req, res){
    const { url, text } = req.body;
    // const userId = res.locals.user.id;

    return res.send(res.locals.arrayEx);
    
    try{
        await postsRepository.createPost(userId, url, text);

        // const { rows: postId } = await postsRepository.getUserLastPostId(userId);

        if(text) {
            const { hashtagsToRegister } = res.locals;
            return console.log(hashtagsToRegister);

            if(hashtagsToRegister.length !== 0) {
                hashtagsToRegister.map(async hashtag =>
                    await postsRepository.createHashtag(hashtag.toLowerCase())
                );
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