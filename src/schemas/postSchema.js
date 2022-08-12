import Joi from "joi";


const postSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
        "number.integer": "⚠ User ID must be an integer!",
        "number.empty": "⚠ User ID is required!",
    }),
    url: Joi.string().uri().required().messages({
        "string.empty": "⚠ Url is required!",
        "string.uri": "⚠ Url must be an url!"
    }),
    text: Joi.string().required().allow(null, "")
})


export default postSchema

