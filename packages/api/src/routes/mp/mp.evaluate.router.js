import Router from "../../middles/route";
import prisma from "../../configs/prisma";

const router = new Router({
    auth: true
});

router.post('/', async (req, res) => {
    try {
        const { score, content, bookId } = req.body;
        const { id } = req.user;
        const evaluate = await prisma.evaluate.create({
            data: {
                userId: id,
                content,
                score,
                bookId
            }
        });
        res.response.success(evaluate);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/', async (req, res) => {
    try {
        const { bookIds = [], pageSize = 20, pageNo = 1 } = req.query;
        const { id } = req.user;
        const evaluates = await prisma.evaluate.findMany({
            where: {
                userId: id,
                bookId: {
                    in: bookIds 
                }
            },
            include: {
                book: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(evaluates);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const advise = await prisma.advise.findUnique({
            where: {
                id
            }
        });
        res.response.success(advise);
    } catch (error) {
        res.response.error(error);
    }
})


export default router;