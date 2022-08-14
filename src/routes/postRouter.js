import { Router } from "express";
import { post, timeline } from "../controllers/postsControllers.js";
import validateSchema from "../middlewares/schemaValidator.js";
import postSchema from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/post", validateSchema(postSchema), post);
postsRouter.get("/timeline", timeline);

export default postsRouter;
