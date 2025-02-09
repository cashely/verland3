import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const { id } = req.user;
        const books = await prisma.book.findMany();
        res.response.success(books);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({
            where: {
                id
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;