import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.response.success(users);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                address: true,
                pets: true,
            }
        });
        res.response.success(user);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;