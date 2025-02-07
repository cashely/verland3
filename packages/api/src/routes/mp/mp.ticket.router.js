import Router from "../../middles/route";
import prisma from "../../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const { id } = req.user;
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: id
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