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
        const whereCondition = {
            
        }

        if (type) {
            whereCondition.type = type;
        }
        const advises = await prisma.advise.findMany({
            where: whereCondition,
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

router.get('/count', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { type } = req.query;
        const whereCondition = {
            
        }

        if (type) {
            whereCondition.type = type;
        }
        const count = await prisma.advise.count({
            where: whereCondition
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

router.put('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            replayContent: z.string().min(1)
        })
    })
)), async (req, res) => {
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