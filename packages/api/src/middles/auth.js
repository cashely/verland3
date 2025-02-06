import { verifyToken } from '../utils';

function getTokenFromString(tokenString) {
    if (!tokenString) {
        return null;
    }
    return tokenString.split(' ')[1];
}





export default (req, res, next) => {
    let { token } = req.headers;
    if (!token) {
        token = req.query.token;
    }
    const tokenStr = getTokenFromString(token);
    console.log(token, 'token')

    console.log( res.response, ' res.response')
    if (!tokenStr) {
        res.response.error(401, 'token 不存在');
        return;
    }
    try {
        const { data } = verifyToken(tokenStr);
        req.user = data;
    } catch (error) {
        res.response.error(401, 'token 无效');
        return;
    }
    
    // req.uuid = decoded.uuid;
    next();
}