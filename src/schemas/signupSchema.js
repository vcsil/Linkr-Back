import joi from "joi";

const userSignUpSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().max(40).required(),
    username: joi.string().max(40).required(),
    profile_img_url: joi.string().uri().required(),
});

export default userSignUpSchema;
