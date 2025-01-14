import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: false
});

prisma.$transaction(async (tx) => {
    //... your transaction operations
})

const transaction = function (res) {
    
}

export default prisma;