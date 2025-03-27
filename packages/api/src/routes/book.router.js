import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1 } = req.query;
        const books = await prisma.book.findMany({
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
                }
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

router.get('/:id', async (req, res) => {
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
                }
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;