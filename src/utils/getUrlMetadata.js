import urlMetadata from "url-metadata";

export default async function getUrlMetadata(posts) {
    let index = 0;

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

    return posts;
};