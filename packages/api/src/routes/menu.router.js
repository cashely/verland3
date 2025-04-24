/**
 * 导入路由中间件
 */
import Router from "../middles/route";
/**
 * 导入 prisma 配置
 */
import prisma from "../configs/prisma";

import validate from "../utils/validate";

/**
 * 创建一个新的路由实例，并设置需要进行身份验证
 * @type {Router}
 */
const router = new Router({
    auth: true
});

/**
 * 获取菜单列表
 * @route GET /api/menus
 * @group 菜单 - 操作菜单的相关接口
 * @param {number} pageSize - 每页显示的数量，默认值为 10
 * @param {number} pageNo - 当前页码，默认值为 1
 * @param {string} name - 菜单名称，用于模糊搜索
 * @returns {object} 200 - 成功响应，包含菜单列表
 * @returns {object} 500 - 服务器内部错误
 */
router.get('/',validate(z => (
    z.object({
        query: z.object({
            name: z.string().optional()
        })
    })
)), async (req, res) => {
    try {
        const { pageSize = 20, pageNo = 1, name } = req.query;
        const whereCondition = {};

        if (!!name) {
            whereCondition.name = {
                contains: name
            }
        }
        const menus = await prisma.menu.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                images: {
                    include: {
                        image: true 
                    }
                } 
            },
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(menus);
    } catch (error) {
        res.response.error(error);
    }
})

router.get('/count',validate(z => (
    z.object({
        query: z.object({
            name: z.string().optional()
        })
    })
)), async (req, res) => {
    try {
        const { name } = req.query;
        const whereCondition = {};

        if (!!name) {
            whereCondition.name = {
                contains: name
            }
        }
        const count = await prisma.menu.count({
            where: whereCondition
        });
        res.response.success(count);
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 获取指定 ID 的菜单详情
 * @route GET /api/menus/:id
 * @group 菜单 - 操作菜单的相关接口
 * @param {string} id - 菜单的唯一标识符
 * @returns {object} 200 - 成功响应，包含菜单详情
 * @returns {object} 500 - 服务器内部错误
 */
router.get('/:id', validate((z) => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await prisma.menu.findUnique({
            where: {
                id
            },
            include: {
                images: {
                    include: {
                        image: true 
                    }
                } 
            }
        });
        res.response.success(menu);
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 创建新的菜单
 * @route POST /api/menus
 * @group 菜单 - 操作菜单的相关接口
 * @param {string} name - 菜单名称
 * @param {number} price - 菜单价格
 * @param {string} description - 菜单描述
 * @param {string[]} imageIds - 关联的图片 ID 列表
 * @returns {object} 200 - 成功响应，包含创建的菜单
 * @returns {object} 500 - 服务器内部错误
 */
router.post('/', validate((z) => (
    z.object({
        body: z.object({
            expressWays: z.string().optional(),
            name: z.string().min(1),
            price: z.number().min(1),
            description: z.string().min(1),
            imageIds: z.array(z.string().min(1)).optional(),
            isRite: z.optional(z.union([z.literal(1), z.literal(2)])),
            isHandleWay: z.optional(z.union([z.literal(1), z.literal(2)])),
            isBookDate: z.optional(z.union([z.literal(1), z.literal(2)])),
        })
    })
)), async (req, res) => {
    try {
        const { name, price, description, imageIds = [], isRite, isHandleWay, isBookDate, expressWays } = req.body;
        const menu = await prisma.menu.create({
            data: {
                name,
                price,
                description,
                isHandleWay,
                isRite,
                expressWays,
                isBookDate,
                images: {
                    createMany: {
                        data: imageIds.map((imageId) => ({
                            imageId
                        }))
                    }
                }
            }
        });
        res.response.success(menu);
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 更新指定 ID 的菜单
 * @route PUT /api/menus/:id
 * @group 菜单 - 操作菜单的相关接口
 * @param {string} id - 菜单的唯一标识符
 * @param {string} name - 菜单名称
 * @param {number} price - 菜单价格
 * @param {string} description - 菜单描述
 * @param {string[]} imageIds - 关联的图片 ID 列表
 * @returns {object} 200 - 成功响应，包含更新的菜单
 * @returns {object} 500 - 服务器内部错误
 */
router.put('/:id', validate((z) => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        }),
        body: z.object({
            expressWays: z.string().optional(),
            name: z.string().min(1),
            price: z.number().min(1),
            description: z.string().min(1),
            imageIds: z.array(z.string().min(1)).optional(),
            isRite: z.optional(z.union([z.literal(1), z.literal(2)])),
            isHandleWay: z.optional(z.union([z.literal(1), z.literal(2)])),
            isBookDate: z.optional(z.union([z.literal(1), z.literal(2)])),
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, imageIds = [], isRite, isHandleWay, isBookDate, expressWays } = req.body;
        const menu = await prisma.menu.update({
            where: {
                id
            },
            data: {
                name,
                price,
                description,
                isRite,
                isHandleWay,
                expressWays,
                isBookDate,
                images: {
                    createMany: {
                        data: imageIds.map((imageId) => ({
                            imageId
                        }))
                    }
                }
            }
        });
        res.response.success(menu);
    } catch (error) {
        res.response.error(error);
    }
})

/**
 * 删除指定 ID 的菜单
 * @route DELETE /api/menus/:id
 * @group 菜单 - 操作菜单的相关接口
 * @param {string} id - 菜单的唯一标识符
 * @returns {object} 200 - 成功响应，包含删除的菜单
 * @returns {object} 500 - 服务器内部错误
 */
router.delete('/:id', validate(z => (
    z.object({
        params: z.object({
            id: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await prisma.menu.delete({
            where: {
                id
            }
        });
        res.response.success(menu);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;
