import Router from "../middles/route";
import { transaction } from "../configs/prisma";

const adminUserRouter = new Router({
    auth: true
})
.get('/', async (req, res) => {
    transaction(async (prisma) => {
        const { id } = req.user;
        const user = await prisma.adminUser.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                createdAt: true,
            }
        });
        res.response.success(user);
    }, res);
})

export default adminUserRouter;