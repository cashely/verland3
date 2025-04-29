import dayjs from "dayjs";
import Router from "../../middles/route";
import prisma, { transaction } from "../../configs/prisma";
import payment from "../../utils/wechat.pay.sdk";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.post('/', validate(z => (
    z.object({
        body: z.object({
            province: z.string().optional(),
            city: z.string().optional(),
            area: z.string().optional(),
            detail: z.string().optional(),
            isSelfExpress: z.union([z.literal(1), z.literal(2)]).default(2),
            petStoreId: z.string().optional(),
            petname: z.string().min(1),
            type: z.string().min(1),
            subType: z.string().min(1),
            bookGoodIds: z.array(z.string()).optional(),
            menuId: z.string().min(1),
            bookDateTime: z.string().optional(),
            handleWay: z.number().int().default(1),
            handleDateTime: z.string().optional(),
            isRite: z.union([z.literal(1), z.literal(2)]).default(2),
            riteDateTime: z.string().optional(),
            mark: z.string().optional(),
            payChannel: z.number().int().default(1),
            channel: z.number().int().default(1),
            phone: z.string().length(11),
            username: z.string().min(1),
            expressWay: z.number().int(),
            expressDateTime: z.string().optional(),
        })
    })
)), async (req, res) => {
    transaction(async (prisma) => {
        const { id } = req.user;

        // 如果遗物提取时间小于仪式时间，则返回

        const { riteDateTime, handleDateTime, bookDateTime } = req.body;

        // 查询当前时间是否已经被预约，如果已经被预约，则返回给前端错误
        if (bookDateTime) {
            // 检查当前时间是否在两个小时以后，如果不是，则返回错误
            if (!dayjs(bookDateTime).isAfter(dayjs().add(2, 'hour'))) {
                throw new Error('预约时间必须在当前时间的两个小时以后，请重新选择');
            }
            const isThisTimeHasBook = await prisma.book.findFirst({
                where: {
                    bookDateTime: {
                        equals: bookDateTime
                    },
                    statu: 1
                }
            });
    
            if (!!isThisTimeHasBook) {
                throw new Error('该上门预约时间已经被预约，请选择其他时间'); 
            }
        }
        // 上门提取时间跟仪式时间都存在的情况下
        // 如果上门提取时间小于仪式时间，不允许下单
        if (handleDateTime && riteDateTime) {
            if (!dayjs(handleDateTime).isAfter(dayjs(riteDateTime).add(1, 'day'))) {
                throw new Error('纪念物领取时间必须在仪式之后的二十四小时以后，请重新选择');
            }
        }

        // 查询当前仪式时间是否已经被预约，如果已经被预约，则返回给前端错误
        if (riteDateTime) {
            // 检查当前时间是否在两个小时以后，如果不是，则返回错误
            if (!dayjs(riteDateTime).isAfter(dayjs().add(2, 'hour'))) {
                throw new Error('预约时间必须在当前时间的两个小时以后，请重新选择');
            }
            const isThisTimeHasBook = await prisma.book.findFirst({
                where: {
                    riteDateTime: {
                        equals: riteDateTime
                    },
                    statu: 1
                }
            }); 
            if (!!isThisTimeHasBook) {
                throw new Error('该仪式预约时间已经被预约，请选择其他时间'); 
            }
        }

        let address = {};
        const { expressWay, petStoreId } = req.body;

        if (expressWay === 3) {
            const { province, city, area, detail } = req.body;
            address = await prisma.address.create({
                data: {
                    userId: id,
                    province,
                    city,
                    area,
                    detail
                }
            });
        }

        const { petname, weight, age, type, subType } = req.body;
        const pet = await prisma.pet.create({
            data: {
                userId: id,
                petname,
                weight,
                age,
                type,
                subType,
                statu: 2
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
        const menuAmount = menu.price;

        // 计算价格  总价格 = 附加服务价格 + 套餐价格 + (体重范围 - 1) * 1分
        // const totalAmount = bookGoodsAmount + menuAmount + (weight - 1) * 1;

        let totalAmount = bookGoodsAmount + menuAmount;

        if (expressWay === 2 && petStoreId) {
            // 查询选择宠物门店信息
            const petStore = await prisma.petStore.findUnique({
                where: {
                    id: petStoreId
                }
            });

            if (!petStore) {
                throw new Error('宠物门店不存在');
            }

            totalAmount += petStore.price;

        }

        const { id: addressId } = address;
        const { id: petId } = pet;
        const { handleWay, isRite, payChannel = 1, mark, phone, username, expressDateTime } = req.body;

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
                expressWay,
                expressDateTime,
                menu: {
                    connect: { id: menuId } 
                },
                pet: {
                    connect: { id: petId }
                },
                address: addressId ? {
                    connect: { id: addressId }
                } : undefined,
                user: {
                    connect: { id }
                },
                petStore: petStoreId ? {
                    connect: { id: petStoreId }
                }: undefined
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

router.get('/', validate(z => (
    z.object({
    })
)), async (req, res) => {
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
                menu: {
                    include: {
                        images: {
                            include: {
                                image: true
                            }
                        } 
                    }
                },
                evaluate: true,
                ticket: true,
                petStore: true
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

router.get('/count', validate(z => (
    z.object({
    })
)), async (req, res) => {
    try {
        const { id } = req.user;
        const { statu } = req.query;
        const whereCondition = {
            userId: id
        }
        if (Number.isInteger(statu)) {
            whereCondition.statu = statu;
        }
        const count = await prisma.book.count({
            where: whereCondition,
        });
        res.response.success(count);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/hasBookDate', validate(z => (
    z.object({
        query: z.object({
            start: z.string().min(1),
            end: z.string().min(1)
        }) 
    })
)), async (req, res) => {
    try {
        const { start, end } = req.query;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const books = await prisma.book.findMany({
            where: {
                bookDateTime: {
                    gte: startDate,
                    lte: endDate
                },
                statu: 1
            }
        });
        res.response.success(books);
    } catch (error) {
        res.response.error(error); 
    }
})

/**
 * 检查特定的预约日期是否可用
  */
router.post('/checkBookDateTime', validate(z => (
    z.object({
        body: z.object({
            bookDateTime: z.string().min(1),
        }) 
    })
)), async (req, res) => {
  try {
      // const { bookDateTime } = req.body;
      const bookDateTime = new Date(req.body.bookDateTime);
      const book = await prisma.book.findFirst({
          where: {
              bookDateTime: {
                  equals: bookDateTime
              },
              statu: 1
          }
      });
      res.response.success(!book);
  } catch (error) {
      res.response.error(error); 
  }
})

/**
 * 检查特定的仪式日期是否可用
  */
router.post('/checkRiteDateTime', validate(z => (
    z.object({
        body: z.object({
            riteDateTime: z.string().min(1),
        }) 
    })
)), async (req, res) => {
  try {
      // const { bookDateTime } = req.body;
      const riteDateTime = new Date(req.body.riteDateTime);
      const book = await prisma.book.findFirst({
          where: {
              riteDateTime: {
                  equals: riteDateTime
              },
              statu: 1
          }
      });
      res.response.success(!book);
  } catch (error) {
      res.response.error(error); 
  }
})

router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
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
                menu: {
                    include: {
                        images: {
                            include: {
                                image: true
                            }
                        } 
                    }
                },
                evaluate: true,
                ticket: true,
                petStore: true
            }
        });
        res.response.success(book);
    } catch (error) {
        res.response.error(error);
    }
})




export default router;
