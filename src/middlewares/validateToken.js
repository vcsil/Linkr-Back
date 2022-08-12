import sessionRepository from "../repositories/sessionRepository.js";
import userRepository from "../repositories/userRepository.js";

export default async function validateToken(req, res, next) {
    // conferir header
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Não enviou token.");
    }

    try {
        const { rows: sessions } = await sessionRepository.getSessionByToken(
            token
        );
        const [session] = sessions;
        if (!session) {
            return res.status(401).send("Não existe sessão.");
        }
        const { rows: users } = await userRepository.getUserById(
            session.user_id
        );
        const [user] = users;
        if (!user) {
            return res.status(401).send("Usuário não encontrado");
        }

        res.locals.user = user;
        res.locals.idSession = session.id;
        return next();
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}
