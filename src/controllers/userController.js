import sanitizeString from "../utils/sanitizeStrings.js";
import userRepository from "../repositories/userRepository.js";

async function getTrending(req, res) {
    try {
        const { rows: trendingHashtags } = await userRepository.getTrendingHashtags();

        res.status(200).send(trendingHashtags);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

async function getHashtagPosts(req, res) {
    const hashtag = sanitizeString(req.params.hashtag);

    try {
        const { rows: hashtagPosts, rowsCount: countPosts } = await userRepository.getHashtagPosts(hashtag);

        if(countPosts === 0) {
            return res.status(404).send("This hashtag doesn't exist!");
        };
        
        res.status(200).send(hashtagPosts);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { getTrending, getHashtagPosts };