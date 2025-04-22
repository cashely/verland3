import Router from "../middles/route";
import prisma from "../configs/prisma";
import validate from "../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
        query: z.object({
            start: z.string().optional().nullable(),
            end: z.string().optional().nullable(),
            menuId: z.string().optional().nullable(),
        })
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, statu, start, end, menuIds = '' } = req.query;
        const menuIdsArr = menuIds.split(',');
        const whereCondition = {}
        if (statu ?? false) {
            whereCondition.statu = Number(statu);
        }

        if (start || end) {
          whereCondition.createdAt = {}
        }
      
        if (start) {
            whereCondition.createdAt.gte = new Date(start)
        }
        if (end) {
            whereCondition.createdAt.lte = new Date(end)
        }
        if (menuIds && menuIdsArr.length > 0) {
            whereCondition.menuId = {
                in: menuIdsArr
            }
        }
        const books = await prisma.book.findMany({
            where: whereCondition,
            include: {
                user: true,
                address: true,
                pet: true,
                evaluate: true,
                ticket: true,
                bookGoods: {
                    include: {
                       bookGood: true 
                    }
                },
                menu: {
                    include: {
                        images: {
                            include: {
                                image: true
                            }
                        } 
                    }
                },
                petStore: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(books);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/count', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { statu, start, end, menuIds = '' } = req.query;
        const menuIdsArr = menuIds.split(',');
        const whereCondition = {}
        if (statu ?? false) {
            whereCondition.statu = Number(statu);
        }

        if (start || end) {
          whereCondition.createdAt = {}
        }
      
        if (start) {
            whereCondition.createdAt.gte = new Date(start)
        }
        if (end) {
            whereCondition.createdAt.lte = new Date(end)
        }
        if (menuIds && menuIdsArr.length > 0) {
            whereCondition.menuId = {
                in: menuIdsArr
            }
        }
      
        const count = await prisma.book.count({
            where: whereCondition,
        });
        res.response.success(count);
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
        const book = await prisma.book.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                address: true,
                pet: true,
                evaluate: true,
                ticket: true,
                bookGoods: {
                    include: {
                       bookGood: true 
                    }
                },
                menu: {
                    include: {
                        images: {
                            include: {
                                image: true
                            }
                        } 
                    }
                },
                petStore: true
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})

router.put('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            statu: z.number().int().gte(0).lte(6),
            expressNo: z.string().optional(),
            expressName: z.string().optional()
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const { statu, expressNo, expressName } = req.body;
        const book = await prisma.book.update({
            where: {
                id
            },
            data: {
                statu,
                expressName,
                expressNo
            },
        })
        res.response.success(book);
    }   catch (error) {
        res.response.error(error); 
    }
})

export default router;
