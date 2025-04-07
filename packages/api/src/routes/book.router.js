import Router from "../middles/route";
import prisma from "../configs/prisma";
import validate from "../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
        query: z.object({
            pageSize: z.number().min(1).default(20),
            pageNo: z.number().min(1).default(1),
            statu: z.number().int().gte(0).lte(6)
        })
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, statu } = req.query;
        const whereCondition = {}
        if (statu ?? false) {
            whereCondition.statu = Number(statu);
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
                menu: true
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
                menu: true
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