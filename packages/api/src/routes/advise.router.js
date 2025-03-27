import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const { pageSize, pageNo } = req.query;
        const advises = await prisma.advise.findMany({
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

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { replayContent } = req.body;
        const advise = await prisma.advise.update({
            where: {
                id
            },
            data: {
                replayContent,
                replayAt: new Date()
            }
        });
        res.response.success(advise);
    } catch (error) {
        res.response.error(error);
    }
})


export default router;