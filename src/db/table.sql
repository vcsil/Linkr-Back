CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(40) NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT(40) NOT NULL,
    "profile_img_url" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "sessions" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES users(id),
    "token" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "posts" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES users(id),
    "text" TEXT,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "post_likes" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES users(id),
    "post_id" INTEGER NOT NULL REFERENCES posts(id),
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "hashtags" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "post_hashtags" (
    "id" SERIAL PRIMARY KEY,
    "post_id" INTEGER NOT NULL REFERENCES postS(id),
    "hashtag_id" INTEGER NOT NULL REFERENCES hashtags(id)
);