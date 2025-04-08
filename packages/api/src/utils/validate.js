import z from 'zod';
/**
 *  * 验证函数
 * @param { object } schema 
 * @returns
 */
function validate(schema) {
    return (req, res, next) => {
        const validateResult = schema(z).safeParse(req);
        if (!validateResult.success) {
            console.log(validateResult.error)
            return res.response.error({ message: validateResult.error.issues });
        }
        next();
    };
}

export default validate;