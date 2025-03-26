import { PrismaClient } from '@prisma/client';
import md5 from 'md5';

const prisma = new PrismaClient({
});

export function transaction (callback, res, errorMessage = '') {
    return prisma.$transaction(async (tx) => {
        try {
            await callback(tx);
        } catch (error) {
            console.log(error);
            res.response.error({
                message: errorMessage || error.message,
                code: 400
            });
        }
    })
}

/**
 * 先查询数据库是否存在admin用户，如果没有的话则创建一个admin用户
 */

prisma.adminUser.findFirst({
    where: {
        username: 'admin'
    }
}).then(async (user) => {
    if (!user) {
        try {
            await prisma.adminUser.create({
                data: {
                    username: 'admin',
                    password: md5('admin')
                }
            })
        } catch (error) {
            console.log(error, 'error')
        }
    }
})
.catch(error => {
    console.log(error);
})

export default prisma;