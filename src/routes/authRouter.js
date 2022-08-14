import { Router } from "express";

import authEmailValidation from "../middlewares/authEmailValidationMiddleware.js";
import {
    deleteSession,
    signUp,
    singIn,
} from "../controllers/authController.js";
import validateSchema from "../middlewares/schemaValidator.js";
import validateToken from "../middlewares/validateToken.js";
import userSignUpSchema from "../schemas/signupSchema.js";
import userSignInSchema from "../schemas/signInSchema.js";

const authRouter = Router();

authRouter.post(
    "/sign-up",
    validateSchema(userSignUpSchema),
    authEmailValidation,
    signUp
);
authRouter.post("/sign-in", validateSchema(userSignInSchema), singIn);
authRouter.delete("/log-off", validateToken, deleteSession);

export default authRouter;
