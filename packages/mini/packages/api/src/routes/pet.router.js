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

        const { userIds } = req.query;
        const pets = await prisma.pet.findMany({
            where: {
                userId: {
                    in: userIds
                }
            }
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
            }
        });
        res.response.success(pet);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;