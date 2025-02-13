import Router from '../../middles/route';
import prisma from '../../configs/prisma';

const router = new Router({
    auth: true,
});


router.get('/', async (req, res) => {
    try {
        const bookGoods = await prisma.bookGood.findMany();
        res.response.success(bookGoods);
    } catch (error) {
        res.response.error(error);
    }
});

router.get('/:id', async (req, res) => {
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
