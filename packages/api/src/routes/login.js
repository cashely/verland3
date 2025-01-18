import { transaction } from '../configs/prisma';
import Router from "../middles/route";

const loginRouter = new Router({
    auth: false
})

loginRouter.post('/', async (req, res) => {
    transaction(async (prisma) => {
        
    }, res);
})


export default loginRouter;

