import Router from "../middles/route";
import prisma from "../configs/prisma";
import validate from "../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
        query: z.object({
            nickname: z.string().optional(),
            username: z.string().optional(),
        })
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, nickname, username } = req.query;
        const whereConditions = {};
        if (nickname) {
            whereConditions.nickname = { contains: nickname };
        }
        if (username) {
            whereConditions.username = { contains: username };
        }
        const users = await prisma.user.findMany({
            where: whereConditions,
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
            include: {
                address: true,
                pets: true,
            }
        });
        res.response.success(users);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                address: true,
                pets: true,
            }
        });
        res.response.success(user);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;