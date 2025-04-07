import Router from "../../middles/route";
import prisma  from "../../configs/prisma";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});


router.get('/', validate(z => (
    z.object({
        query: z.object({
            pageSize: z.number().min(1).default(20),
            pageNo: z.number().min(1).default(1),
        })
    })
)), async (req, res) => {
    const { id } = req.user;
    const { pageSize = 20, pageNo = 1 } = req.query;
    const books = await prisma.pet.findMany({
        where: {
            userId: id
        },
        include: {
            book: true,
            petImage: {
                include: {
                    image: true 
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
})

router.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    const { id } = req.params;
    const pet = await prisma.pet.findUnique({
        where: {
            id
        },
        include: {
            book: true,
            petImage: true
        }
    });
    res.response.success(pet);
})

router.post('/', validate(z => (
    z.object({
        body: z.object({
            petname: z.string().min(1),
            statu: z.union([z.literal(1), z.literal(2)]).default(1),
            imageIds: z.array(z.string().min(1)).optional(),
            weight: z.number().int().min(1),
            age: z.number().int().min(1),
            type: z.string().min(1),
            subType: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.user;
        const { petname, weight, age, type, subType, statu = 1, imageIds = [] } = req.body;
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
        const _ = await prisma.petImage.createMany({
            data: imageIds.map((imageId) => ({
                petId: pet.id,
                imageId
            })) 
        })

        const petInfo = await prisma.pet.findUnique({
            where: {
                id: pet.id
            },
            include: {
                book: true,
                petImage: true
            }
        });
        res.response.success(petInfo);
    }   catch (error) {
        res.response.error(error);
    }
})

router.put('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            petname: z.string().min(1),
            statu: z.union([z.literal(1), z.literal(2)]).default(1),
            imageIds: z.array(z.string().min(1)).optional(),
            weight: z.number().int().min(1),
            age: z.number().int().min(1),
            type: z.string().min(1),
            subType: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const { nickname, weight, age, type, subType, statu = 1, imageIds = [] } = req.body;
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
                statu,
            },
            include: {
                book: true,
                petImage: true
            }
        });
        res.response.success(pet);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;