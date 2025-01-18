import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
});

export function transaction (callback, res, errorMessage = '') {
    return prisma.$transaction(async (tx) => {
        try {
            await callback(tx);
        } catch (error) {
            res.response.error({
                message: errorMessage || error.message,
                code: 500
            });
        }
    })
}

console.log(prisma, 'prisma')

export default prisma;