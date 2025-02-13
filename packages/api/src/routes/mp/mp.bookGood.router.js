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


export default router;
