import Router from "../../middles/route"
import prisma, { transaction } from "../../configs/prisma"
import validate from "../../utils/validate"

const router = new Router({
    auth: true
})

/**
 * 获取宠物门店列表
 */
router.get('/', validate(z => (
    z.object({
        query: z.object({
            name: z.string().optional()
        })
    })
)), async (req, res) => {
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

router.get('/count', validate(z => (
    z.object({
        query: z.object({
            name: z.string().optional()
        })
    })
)), async (req, res) => {
    try {
        const { name } = req.query;
        const whereCondition = {};

        if (!!name) {
            whereCondition.name = {
                contains: name
            }
        }
        const count = await prisma.petStore.count({
            where: whereCondition,
        });
        res.response.success(count);
    } catch (error) {
        res.response.error(error);
    }
})


export default router;