import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1 } = req.query;
        const tickets = await prisma.ticket.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
            include: {
                book: true,
                file: true,
                user: true,
            }
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

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, fileId } = req.body;
        const ticket = await prisma.ticket.update({
            where: {
                id
            },
            data: {
                status,
                fileId
            }
        });
        res.response.success(ticket);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;