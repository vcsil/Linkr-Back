import postsRepository from "../repositories/postsRepositories.js";


export async function post(req, res){
    const { user_id, url, text } = req.body

    try{
        await postsRepository.createPosts(user_id, url, text)
        return res.sendStatus(201)
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