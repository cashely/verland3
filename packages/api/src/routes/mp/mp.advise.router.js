import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.post('/', validate(z => (
    z.object({
        body: z.object({
            type:z.union([z.literal(1), z.literal(2)]).default(1),
            content: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { type, content } = req.body;
        const { id } = req.user;
        const advise = await prisma.advise.create({
            data: {
                userId: id,
                content,
                type
            }
        });
        res.response.success(advise);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { id } = req.user;
        const { pageSize = 20, pageNo = 1 } = req.query;
        const advises = await prisma.advise.findMany({
            where: {
                userId: id
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
            include: {
                user: true,
            }
        });
        res.response.success(advises);
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
            },
            include: {
                user: true,
            }
        });
        res.response.success(advise);
    } catch (error) {
        res.response.error(error);
    }
})


export default router;