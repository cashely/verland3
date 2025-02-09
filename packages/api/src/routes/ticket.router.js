import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany();
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