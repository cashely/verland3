import Router from "../../middles/route";
import prisma from "../../configs/prisma";

const router = new Router({
    auth: true
});

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const { id } = req.user;
        const advises = await prisma.advise.findMany({
            where: {
                userId: id
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


export default router;