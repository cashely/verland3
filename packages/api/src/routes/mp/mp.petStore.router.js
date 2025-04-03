import Router from "../../middles/route"
import prisma, { transaction } from "../../configs/prisma"

const router = new Router({
    auth: true
})

/**
 * 获取宠物门店列表
 */
router.get('/', async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, name } = req.query;
        const whereCondition = {};

        if (!!name) {
            whereCondition.name = {
                contains: name
            }
        }
        const petStores = await prisma.petStore.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(petStores);
    } catch (error) {
        res.response.error(error);
    }
})


export default router;