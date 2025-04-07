import Router from "../middles/route";
import { transaction } from "../configs/prisma";
import validate from "../utils/validate";

const adminUserRouter = new Router({
    auth: true
})
.get('/', validate(z => (
    z.object({
        query: z.object({
            pageSize: z.number().min(1).default(20),
            pageNo: z.number().min(1).default(1)
        })
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

export default adminUserRouter;