import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

/**
 * @name 获取所有宠物
 */
router.get('/', async (req, res) => {
    try {

        const { userIds = [], pageSize = 20, pageNo = 1, username } = req.query;
        const whereConditions = {};
        if (userIds.length > 0) {
            whereConditions.userId = { in: userIds };
        }
        if (username) {
            const users = await prisma.user.findMany({
                where: {
                    username: { contains: username }
                },
            });
            if (users.length > 0) {
                whereConditions.userId = { in: users.map(user => user.id) };
            }
        }
        const pets = await prisma.pet.findMany({
            where: whereConditions,
            include: {
                images: true,
                petImage: {
                    include: {
                        image: true
                    }
                },
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(pets);
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * @name 根据id获取单只宠物详情
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await prisma.pet.findUnique({
            where: {
                id
            },
            include: {
                images: true,
                petImage: {
                    include: {
                        image: true
                    }
                },
                user: true
            }
        });
        res.response.success(pet);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;