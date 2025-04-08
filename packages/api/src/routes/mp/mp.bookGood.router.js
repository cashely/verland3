import Router from '../../middles/route';
import prisma from '../../configs/prisma';
import validate from '../../utils/validate';

const router = new Router({
    auth: true,
});


router.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1 } = req.query;
        const bookGoods = await prisma.bookGood.findMany({
            include: {
                thumb: true
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(bookGoods);
    } catch (error) {
        res.response.error(error);
    }
});

router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string(),
        }),
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const bookGood = await prisma.bookGood.findUnique({
            where: {
                id,
            },
        });
        res.response.success(bookGood);
    } catch (error) {
        res.response.error(error);
    }
});


export default router;
