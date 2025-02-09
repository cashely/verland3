import Router from "../../middles/route";
import prisma from "../../configs/prisma";

const router = new Router({
    auth: true
});

router.get('/', async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id
            }
        });
        res.response.success(user);
    } catch (error) {
        res.response.error(error);
    }
})
.put('/', async (req, res) => {
    try {
        const { avatar, nickname, phone, addressId } = req.body;
        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                avatar,
                nickname,
                phone,
                addressId
            }
        });
        res.response.success(user);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;