import Router from "../middles/route";
import prisma from "../configs/prisma";

const router = new Router();

/**
 * @name 接受微信支付回调
 * 
 */

// {
//     "id": "EV-2018022511223320873",
//     "create_time": "2015-05-20T13:29:35+08:00",
//     "resource_type": "encrypt-resource",
//     "event_type": "TRANSACTION.SUCCESS",
//     "summary": "支付成功",
//     "resource": {
//         "original_type": "transaction",
//         "algorithm": "AEAD_AES_256_GCM",
//         "ciphertext": "",
//         "associated_data": "",
//         "nonce": ""
//     }
// }
router.post('/wxpay/notify_url', async (req, res) => {
    try {
        const { event_type } = req.body;
        if (event_type === "TRANSACTION.SUCCESS") {
            // 支付成功
            // 1. 解密resource
            // 2. 更新订单状态
            // 3. 发送模板消息
            // 4. 发送微信通知

        }
        req.response.success("接受微信支付成功");
    } catch (error) {
        res.response.error(error);
    }
})

export default router;