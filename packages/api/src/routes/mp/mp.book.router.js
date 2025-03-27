import Router from "../../middles/route";
import prisma, { transaction } from "../../configs/prisma";
import payment from "../../utils/wechat.pay.sdk";

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

        const { petname, weight, age, type, subType, statu = 2 } = req.body;
        const pet = await prisma.pet.create({
            data: {
                userId: id,
                petname,
                weight,
                age,
                type,
                subType,
                statu
            }
        });

        

        const { id: addressId } = address;
        const { id: petId } = pet;
        const { menu, bookDateTime, hadnleWay, handleDateTime, isRite, riteDateTime, totalAmount, payChannel = 1, mark, phone, username } = req.body;

        const book = await prisma.book.create({
            data: {
                userId: id,
                addressId,
                menu,
                bookDateTime,
                hadnleWay,
                handleDateTime,
                isRite,
                riteDateTime,
                totalAmount,
                payChannel,
                mark,
                petId,
                phone,
                username
            }
        });

        const { bookGoodIds = []} = req.body;

        if (bookGoodIds.length > 0) {
            await prisma.BookRelationBookGood.createMany({
                data: bookGoodIds.map((bookGoodId) => ({
                    bookGoodId,
                    bookId: book.id
                })) 
            })
        }
        res.response.success(book);
    }, res);
})

router.get('/', async (req, res) => {
    try {
        const { id } = req.user;
        const { statu, pageSize = 20, pageNo = 1 } = req.query;
        const whereCondition = {
            userId: id
        }
        if (Number.isInteger(statu)) {
            whereCondition.statu = statu;
        }
        const books = await prisma.book.findMany({
            where: whereCondition,
            include: {
                address: true,
                pet: true,
                bookGoods: {
                    include: {
                        bookGood: true 
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
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
            },
            include: {
                address: true,
                pet: true,
                bookGoods: {
                    include: {
                        bookGood: true 
                    }
                }
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})



export default router;