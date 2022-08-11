import { Router } from "express";

import authEmailValidation from "../middlewares/authEmailValidationMiddleware.js";
import signUp from "../controllers/authController.js";
import validateSchema from "../middlewares/schemaValidator.js";
import userSignUpSchema from "../schemas/signupSchema.js";

const authRouter = Router();

authRouter.post(
    "/signup",
    validateSchema(userSignUpSchema),
    authEmailValidation,
    signUp
);

export default authRouter;
