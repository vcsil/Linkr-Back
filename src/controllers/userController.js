import sanitizeString from "../utils/sanitizeStrings.js";
import userRepository from "../repositories/userRepository.js";

async function getTrending(req, res) {
    try {
        const { rows: trendingHashtags, rowsCount: countHashtags } = await userRepository.getTrendingHashtags();

        if(countHashtags === 0) {
            return res.status(404).send("0 hashtags were used so far!");
        };

        res.status(200).send(trendingHashtags);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export { getTrending };