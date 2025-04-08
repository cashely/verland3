import Router from "../middles/route";
import prisma from "../configs/prisma";
import validate from "../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, type } = req.query;
        const whereConditions = {};
        if (type) {
            whereConditions.type = type;
        }
        const tickets = await prisma.ticket.findMany({
            where: whereConditions,
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
               file: true,
               book: true,
               user: true, 
            }
        });
        res.response.success(ticket);
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
            statu: z.optional(z.union([z.literal(1), z.literal(2), z.literal(3)])),
            fileId: z.optional(z.string().min(1))
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const { statu, fileId } = req.body;
        const ticket = await prisma.ticket.update({
            where: {
                id
            },
            data: {
                statu,
                fileId
            }
        });
        res.response.success(ticket);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;