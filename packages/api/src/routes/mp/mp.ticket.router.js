import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
        query: z.object({
            pageSize: z.number().min(1).default(20),
            pageNo: z.number().min(1).default(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.user;
        const { pageSize = 20, pageNo = 1 } = req.query;
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: id
            },
            include: {
                book: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(tickets);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await prisma.ticket.findUnique({
            where: {
                id
            }
        });
        res.response.success(ticket);
    } catch (error) {
        res.response.error(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const { bookId, type, number, email, header } = req.body;
        const { id } = req.user;
        const ticket = await prisma.ticket.create({
            data: {
                userId: id,
                bookId,
                type,
                number,
                email,
                header
            }
        });
        res.response.success(ticket);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;