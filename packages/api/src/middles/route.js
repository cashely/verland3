import { Router as ExpressRouter } from 'express';
import { verifyToken } from '../utils';

function getTokenFromString(tokenString) {
    if (!tokenString) {
        return null;
    }
    return tokenString.split(' ')[1];
}

function Router(options = { auth: false }) {
    const { auth } = options;
    const router = ExpressRouter();

    if (auth) {
        router.use((req, res, next) => {

            const { token } = req.headers;
            const tokenStr = getTokenFromString(token);
            if (!tokenStr) {
                res.response.noLogin();
                return;
            }
            try {
                const { data } = verifyToken(tokenStr);
                req.user = data;
            } catch (error) {
                res.response.noLogin("token无效");
                return;
            }
            next();
        })
    }
    return router;

    
}

export default Router;