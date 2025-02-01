import zod from 'zod';
import md5 from 'md5';
import { transaction } from '../configs/prisma';
import Router from "../middles/route";
import { signToken } from '../utils';

const loginRouter = new Router({
    auth: false
})

loginRouter.post('/', async (req, res) => {
    transaction(async (prisma) => {
        const {username, password} = req.body;
        const validated = zod.object({
            username: zod.string().min(1),
            password: zod.string().min(1)
        }).safeParse({
            username,
            password
        })

        if (!validated.success) {
            throw new Error('用户名或密码不能为空');
        }

        const user = await prisma.adminUser.findFirst({
            where: {
                username
            }
        });

        if (!user) {
            throw new Error('用户不存在');
        }

        // console.log(md5(user.password), password)

        if (user.password !== md5(password)) {
            throw new Error('密码错误');
        }

        const token = signToken({
            username: user.username,
            id: user.id
        });

        res.response.success(token);
    }, res);
})


export default loginRouter;

