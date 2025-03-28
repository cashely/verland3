/**
 * 导入路由中间件
 */
import Router from "../../middles/route";
/**
 * 导入 prisma 配置
 */
import prisma from "../../configs/prisma";

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
router.get('/', async (req, res) => {
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
            skip: (pageNo - 1) * pageSize,
            take: Number(pageSize),
        });
        res.response.success(menus);
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
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await prisma.menu.findUnique({
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