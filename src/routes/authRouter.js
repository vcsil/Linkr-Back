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
    "/signup",
    validateSchema(userSignUpSchema),
    authEmailValidation,
    signUp
);
authRouter.post("/signin", validateSchema(userSignInSchema), singIn);
authRouter.delete("/logoff", validateToken, deleteSession);

export default authRouter;
