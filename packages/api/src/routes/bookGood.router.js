import z from "zod";
import Router from "../middles/route";
import prisma, { transaction } from "../configs/prisma";

const bookGoodRouter = new Router({
    auth: true
})
.get('/', (req, res) => {
    transaction(async (prisma) => {
        const { title } = req.query;
        const bookGood = await prisma.bookGood.findMany({
            where: {
                title: {
                    contains: title
                }
            },
            include: {
                thumb: true,
                thumbId: false
            }
            
        });
        res.response.success(bookGood);
    }, res);
})
.get('/:id', async (req, res) => {
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
.post('/', async (req, res) => {
    try {
        const { title, price, content, thumbId } = req.body;
        const validated = z.object({
            title: z.string().min(1),
            price: z.number().min(1),
            content: z.string().min(1)
        }).safeParse({
            title,
            price,
            content
        });
        if (!validated.success) {
            throw new Error(JSON.stringify(validated.error.format()));
        }

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
.delete('/:id', (req, res) => {
    transaction(async (prisma) => {
        const deleteResult = await prisma.bookGood.delete({
            where: {
                id: req.params.id
            }
        });
        res.response.success(deleteResult);
    }, res);
})
.put('/:id', (req, res) => {
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