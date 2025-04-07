import md5 from 'md5';
import { transaction } from '../configs/prisma';
import Router from "../middles/route";
import { signToken } from '../utils';
import wechatSdk from '../utils/wechat.sdk';
import validate from '../utils/validate';

const loginRouter = new Router({
    auth: false
})

loginRouter.post('/',validate((zod) => (
    zod.object({
        body: zod.object({
            username: zod.string().min(1),
            password: zod.string().min(1)
        })
    })
)), async (req, res) => {
    transaction(async (prisma) => {
        const {username, password} = req.body;

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
.post('/mp', validate((z) => (z.object(
    {
        body: z.object({
            code: z.string().min(1)
        })
    }
))), async (req, res) => {
    transaction(async (prisma) => {
        const { code } = req.body;

        const { openid, session_key, errcode, errmsg } = await wechatSdk.code2Session(code);
        // 查询用户是否已经注册
        let user = await prisma.user.findFirst({
            where: {
                wxid: openid
            }
        });
        // 如果没有注册，就注册一个
        if (!user) {
            user = await prisma.user.create({
                data: {
                    wxid: openid
                }
            });
        }

        const token = signToken({
            wxid: user.wxid,
            id: user.id
        });

        res.response.success(token);
    }, res);
})


export default loginRouter;

