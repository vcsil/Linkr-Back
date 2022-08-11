import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import userRepository from "../repositories/userRepository.js";
import sessionRepository from "../repositories/sessionRepository.js";

export async function signUp(req, res) {
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

export async function singIn(req, res) {
    const { email, password } = req.body;

    try {
        const { rows: users } = await userRepository.getUserByEmail(email);
        const [user] = users;

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await sessionRepository.createSession(user.id, token);
            return res.status(200).send(token);
        }

        return res.status(401).send("Senha ou email incorretos!");
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}
