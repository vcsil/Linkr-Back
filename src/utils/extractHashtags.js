export default function extractHashtags(str) {
    const hashtags = str.match(/#\w+/g);
    if(hashtags){
      return hashtags.map(hashtag => hashtag.slice(1).toLowerCase());
    }
    return [];
};