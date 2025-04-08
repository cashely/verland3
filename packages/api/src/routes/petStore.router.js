import Router from "../middles/route.js";
import prisma, { transaction } from "../configs/prisma.js";
import validate from "../utils/validate.js";

const router = new Router({
    auth: true
});

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

/**
 * 新建宠物门店
 */
router.post('/', validate(z => (
    z.object({
        body: z.object({
            name: z.string().min(1),
            address: z.string().min(1),
            tel: z.string().min(1),
            contact: z.string().min(1),
            price: z.number().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { name, address, tel, contact, price} = req.body;
        await transaction(async (tx) => {
            const petStore = await tx.petStore.create({
                data: {
                    name,
                    address,
                    tel,
                    contact,
                    price
                }
            })
            res.response.success(petStore);
        }, res, '新建宠物门店失败')
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 更新宠物门店
 */
router.put('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            name: z.string().min(1),
            address: z.string().min(1),
            tel: z.string().min(1),
            contact: z.string().min(1),
            price: z.number().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, tel, contact, price} = req.body;
        await transaction(async (tx) => {
            const petStore = await tx.petStore.update({
                where: {
                    id
                },
                data: {
                    name,
                    address,
                    tel,
                    contact,
                    price
                }
            })
            res.response.success(petStore);
        }, res, '更新宠物门店失败')
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 获取单个宠物门店
 */
router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const petStore = await prisma.petStore.findUnique({
            where: {
                id
            }
        })
        res.response.success(petStore);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;