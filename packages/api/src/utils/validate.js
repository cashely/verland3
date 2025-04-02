/**
 *  * 验证函数
 * @param { object } schema 
 * @returns
 */
function validate(schema) {
    return (req, res, next) => {
        const validateResult = schema.safeParse(req);
        if (!validateResult.success) {
            return res.response.error(validateResult.error);
        }
        next();
    };
}

export default validate;