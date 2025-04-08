import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
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
.put('/', validate(z => (
    z.object({
        body: z.object({
            avatar: z.string().optional(),
            nickname: z.string().optional(),
            phone: z.string().optional(),
            addressId: z.string().optional(),
            username: z.string().optional(),
            gender: z.number().optional()
        })
    })
)), async (req, res) => {
    try {
        const { avatar, nickname, phone, addressId, username, gender } = req.body;
        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                avatar,
                nickname,
                phone,
                addressId,
                username,
                gender
            }
        });
        res.response.success(user);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;