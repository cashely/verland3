import Router from "../../middles/route";
import prisma  from "../../configs/prisma";

const router = new Router({
    auth: true
});


router.get('/', async (req, res) => {
    const { id } = req.user;
    const books = await prisma.pet.findMany({
        where: {
            userId: id
        },
        include: {
            address: true,
            pet: true
        }
    });
    res.response.success(books);
})

router.post('/', async (req, res) => {
    const { id } = req.user;
    const { nickname, weight, age, type, subType, statu = 1 } = req.body;
    const pet = await prisma.pet.create({
        data: {
            userId: id,
            nickname,
            weight,
            age,
            type,
            subType,
            statu
        }
    });
    res.response.success(pet);
})

export default router;