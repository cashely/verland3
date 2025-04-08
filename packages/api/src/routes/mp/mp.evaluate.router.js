import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.post('/', validate(z => (
    z.object({
        body: z.object({
            score: z.number().min(1).max(5),
            content: z.string().min(1),
            bookId: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { score, content, bookId } = req.body;
        const { id } = req.user;
        const updateBook = await prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                evaluate: {
                    create: {
                        user: {
                            connect: {
                                id
                            }
                        },
                        score,
                        content
                    }
                }
            }
        });
        res.response.success(updateBook);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/', validate(z => (
    z.object({
        query: z.object({
            bookIds: z.string().array().optional(),
        })
    })
)), async (req, res) => {
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

router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
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