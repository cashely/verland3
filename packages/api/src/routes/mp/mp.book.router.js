import Router from "../../middles/route";
import prisma, { transaction } from "../../configs/prisma";

const router = new Router({
    auth: true
});

router.post('/', async (req, res) => {
    transaction(async (prisma) => {
        const { province, city, area, detail } = req.body;
        const { id } = req.user;
        const address = await prisma.address.create({
            data: {
                userId: id,
                province,
                city,
                area,
                detail
            }
        });

        const { nickname, weight, age, type, subType, statu = 2 } = req.body;
        console.log({
            data: {
                userId: id,
                nickname,
                weight,
                age,
                type,
                subType,
                statu
            }
        }, 'ids')
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


        const { id: addressId } = address;
        const { id: petId } = pet;
        const { menu, bookDateTime, isExpress, expressDateTime, isRite, riteDateTime, totalAmount, payChannel = 1, mark } = req.body;

        const book = await prisma.book.create({
            data: {
                userId: id,
                addressId,
                menu,
                bookDateTime,
                isExpress,
                expressDateTime,
                isRite,
                riteDateTime,
                totalAmount,
                payChannel,
                mark,
                petId
            }
        });
        res.response.success(book);
    }, res);
})

router.get('/', async (req, res) => {
    try {
        const { id } = req.user;
        const books = await prisma.book.findMany({
            where: {
                userId: id
            }
        });
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