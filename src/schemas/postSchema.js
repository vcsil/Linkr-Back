import Joi from "joi";


const postSchema = Joi.object({
    url: Joi.string().uri().required().messages({
        "string.empty": "⚠ Url is required!",
        "string.uri": "⚠ Url must be an url!"
    }),
    text: Joi.string()
});


export default postSchema;

