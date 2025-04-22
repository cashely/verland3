import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
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
                book: {
                  include: {
                    menu: true
                  }
                }
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

router.get('/count', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { id } = req.user;
        const { } = req.query;
        const count = await prisma.ticket.count({
            where: {
                userId: id
            },
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
        const ticket = await prisma.ticket.findUnique({
            where: {
                id
            },
            include: {
                book: {
                  include: {
                    menu: true
                  }
                }
            },
        });
        res.response.success(ticket);
    } catch (error) {
        res.response.error(error);
    }
})

router.post('/', validate(z => (
    z.object({
        body: z.object({
            bookId: z.string().min(1),
            type: z.union([z.literal(1), z.literal(2)]).default('phone'),
            number: z.string().optional(),
            email: z.string().min(1),
            header: z.string().optional()
        })
    })
)), async (req, res) => {
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
