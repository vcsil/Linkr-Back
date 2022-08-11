import { Router } from "express";

import authEmailValidation from "../middlewares/authEmailValidationMiddleware.js";
import { signUp, singIn } from "../controllers/authController.js";
import validateSchema from "../middlewares/schemaValidator.js";
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

export default authRouter;
