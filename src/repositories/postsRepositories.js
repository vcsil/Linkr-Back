import connection from "../db.js"

async function createPosts(user_id, url, text){
    return connection.query(
        `INSERT INTO posts (user_id, url, text) VALUES($1, $2, $3)`,
        [user_id, url, text]
    )
}

async function showPosts(){
    return connection.query(
        `SELECT u.username,p.text,p.url,u."img_url" FROM posts p 
        JOIN users u 
        ON u.id = p.user_id 
        ORDER BY p."created_at" desc LIMIT 20`
    )
}


const postsRepository = {
    createPosts,
    showPosts
}

export default postsRepository