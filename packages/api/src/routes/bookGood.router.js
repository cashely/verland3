import z from "zod";
import Router from "../middles/route";
import prisma, { transaction } from "../configs/prisma";
import validate from "../utils/validate";

const bookGoodRouter = new Router({
    auth: true
})
.get('/', validate(z => (
    z.object({
        query: z.object({
            title: z.string().optional(),
        })
    })
)), (req, res) => {
    transaction(async (prisma) => {
        const { title, pageSize = 20, pageNo = 1 } = req.query;
        const bookGood = await prisma.bookGood.findMany({
            where: {
                title: {
                    contains: title
                }
            },
            include: {
                thumb: true,
                thumbId: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
            
        });
        res.response.success(bookGood);
    }, res);
})
.get('/', validate(z => (
    z.object({
        query: z.object({
            title: z.string().optional(),
        })
    })
)), (req, res) => {
    transaction(async (prisma) => {
        const { title } = req.query;
        const count = await prisma.bookGood.count({
            where: {
                title: {
                    contains: title
                }
            }
            
        });
        res.response.success(count);
    }, res);
})
.get('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const bookGood = await prisma.bookGood.findUnique({
            where: {
                id
            },
            include: {
                thumb: true,
                thumbId: false
            }
        });
        res.response.success(bookGood);
    } catch (error) {
        res.response.error(error.message);
    }
})
.post('/', validate(z => (
    z.object({
        body: z.object({
            title: z.string().min(1),
            price: z.number().min(1),
            content: z.string().min(1),
            thumbId: z.string().optional()
        })
    })
)), async (req, res) => {
    try {
        const { title, price, content, thumbId } = req.body;

        const createResult = await prisma.bookGood.create({
            data: {
                title,
                price,
                content,
                thumbId
            }
        });
        res.response.success(createResult);
    } catch (error) {
        res.response.error(error.message);
    }
})
.delete('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), (req, res) => {
    transaction(async (prisma) => {
        const deleteResult = await prisma.bookGood.delete({
            where: {
                id: req.params.id
            }
        });
        res.response.success(deleteResult);
    }, res);
})
.put('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            title: z.string().min(1),
            price: z.number().min(1),
            content: z.string().min(1),
            thumbId: z.string().optional()
        })
    })
)), (req, res) => {
    transaction(async (prisma) => {
        const { id } = req.params;
        const { title, price, content, thumbId } = req.body;
        const updateResult = await prisma.bookGood.update({
            where: {
                id
            },
            data: {
                title,
                price,
                content,
                thumbId
            }
        });
        res.response.success(updateResult);
    }, res);
})


export default bookGoodRouter;