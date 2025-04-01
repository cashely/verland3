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

        // 查询附加服务
        const { bookGoodIds = []} = req.body;
        const bookGoods = await prisma.bookGood.findMany({
            where: {
                id: {
                    in: bookGoodIds
                }
            }
        });
        const bookGoodsAmount = bookGoods.reduce((total, bookGood) => total + bookGood.price, 0);

        // 查询套餐的价格
        const { menuId } = req.body;
        const menu = await prisma.menu.findUnique({
            where: {
                id: menuId
            }
        });

        console.log(menu, '套餐信息')
        const menuAmount = menu.price;

        // 计算价格
        const totalAmount = bookGoodsAmount + menuAmount;


        

        const { id: addressId } = address;
        const { id: petId } = pet;
        const { bookDateTime, handleWay, handleDateTime, isRite, riteDateTime, payChannel = 1, mark, phone, username } = req.body;

        const book = await prisma.book.create({
            data: {
                bookDateTime,
                handleWay,
                handleDateTime,
                isRite,
                riteDateTime,
                totalAmount,
                payChannel,
                mark,
                phone,
                username,
                menu: {
                    connect: { id: menuId } 
                },
                pet: {
                    connect: { id: petId }
                },
                address: {
                    connect: { id: addressId } 
                },
                user: {
                    connect: { id }
                }
            }
        });

        

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
                },
                menu: true
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
                },
                menu: true
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})



export default router;