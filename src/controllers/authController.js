import bcrypt from "bcrypt";

import userRepository from "../repositories/userRepository.js";

export default async function signUp(req, res) {
    const { username, email, password, profile_img_url } = req.body;

    const SALT = 10;
    const passwordHash = bcrypt.hashSync(password, SALT);

    try {
        await userRepository.createUser(
            username,
            email,
            passwordHash,
            profile_img_url
        );

        return res.sendStatus(201);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}
