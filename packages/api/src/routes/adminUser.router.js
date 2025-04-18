import Router from "../middles/route";
import { transaction } from "../configs/prisma";
import validate from "../utils/validate";

const adminUserRouter = new Router({
    auth: true
})
.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
    transaction(async (prisma) => {
        const { id } = req.user;
        const user = await prisma.adminUser.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                createdAt: true,
            },
        });
        res.response.success(user);
    }, res);
})
.get('/count', validate(z => (
    z.object({})
)), async (req, res) => {
    transaction(async (prisma) => {
        const { id } = req.user;
        const count = await prisma.adminUser.count({
            where: { id }
        });
        res.response.success(count);
    })
})

export default adminUserRouter;