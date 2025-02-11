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

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const pet = await prisma.pet.findUnique({
        where: {
            id
        }
    });
    res.response.success(pet);
})

router.post('/', async (req, res) => {
    try {
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
    }   catch (error) {
        res.response.error(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nickname, weight, age, type, subType, statu = 1 } = req.body;
        const pet = await prisma.pet.update({
            where: {
                id
            },
            data: {
                nickname,
                weight,
                age,
                type,
                subType,
                statu
            }
        });
        res.response.success(pet);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;