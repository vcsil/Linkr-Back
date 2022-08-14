import sanitizeString from "../utils/sanitizeStrings.js";
import userRepository from "../repositories/userRepository.js";

async function getTrending(req, res) {
    try {
        const { rows: trendingHashtags } = await userRepository.getTrendingHashtags();

        res.status(200).send(trendingHashtags);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

async function getHashtagPosts(req, res) {
    const hashtag = sanitizeString(req.params.hashtag);

    try {
        const { rows: hashtagPosts, rowCount: countPosts } = await userRepository.getHashtagPosts(hashtag);

        if(countPosts === 0) {
            return res.status(404).send("There is no posts with this hashtag!");
        };
        
        res.status(200).send(hashtagPosts);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

async function getUserPosts(req, res) {
    const userId = sanitizeString(req.params.id);

    try {
        const { rows: userInfo, rowCount: userCount } = await userRepository.getUserInfo(userId);

        if(userCount === 0) {
            return res.status(404).send("User not found!");
        };

        const { rows: userPosts, rowCount: postsCount } = await userRepository.getUserPosts(userId);

        if(postsCount === 0) {
            return res.status(404).send("This user doesn't have any posts!");
        };

        const allUserPosts = {
            ...userInfo[0],
            userPosts
        };

        res.status(200).send(allUserPosts);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

export { getTrending, getHashtagPosts, getUserPosts };