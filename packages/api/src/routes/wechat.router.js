import payment from '../utils/wechat.pay.sdk';
import Router from "../middles/route";
import prisma from "../configs/prisma";
import { sendTemplateMessage } from "../utils/wechat.helper";
import wxConfig from '../configs/wx.config';

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

            // 1. 解密resource
            const { resource } = req.body;
            const payResult = await payment.decodeResource(resource);
            console.log(payResult)
            // 2. 更新订单状态
            const { out_trade_no } = payResult;
            const updateBook = await prisma.book.update({
                where: {
                    outTradeNo: out_trade_no
                },
                data: {
                    status: 1 // 已预约
                },
                include: {
                    user: true
                }
            });

            const { wxid } = updateBook.user;

            // 3. 发送模板消息
            const templateId = wxConfig.payTemplateId;
            await sendTemplateMessage({
                templateId,
                openid: wxid,
                data: {
                    thing1: {
                        value: '预约成功'
                    },
                    thing2: {
                        value: '预约时间'
                    },
                    thing3: {
                        value: '预约人'
                    },
                    thing4: {
                        value: '预约人电话'
                    },
                    thing5: {
                        value: '预约人地址'
                    },
                    thing6: {
                        value: '预约人宠物'
                    },
                    thing7: {
                        value: '预约人宠物品种'
                    },
                    thing8: {
                        value: '预约人宠物年龄'
                    },
                    thing9: {
                        value: '预约人宠物性别'
                    },
                    thing10: {
                        value: '预约人宠物颜色'
                    },
                    thing11: {
                        value: '预约人宠物数量'
                    },
                }
            })

        } else if (event_type === 'REFUND.SUCCESS') {
            // 退款成功
            // 1. 解密resource
            // 2. 更新订单状态
            // 3. 发送模板消息
            // 4. 发送微信通知

            // 1. 解密resource
            const { resource } = req.body;
            const refundResult = await payment.decodeResource(resource);
            console.log(refundResult)
            const { out_refund_no } = refundResult;

            // 2. 更新订单状态
            const updateBook = await prisma.book.update({
                where: {
                    outRefundNo: out_refund_no
                },
                data: {
                    status: 4 // 已退款
                },
                include: {
                    user: true
                }
            });
            // 3. 发送模板消息
            const { wxid } = updateBook.user;
            const templateId = wxConfig.refundTemplateId;
            await sendTemplateMessage({
                templateId,
                openid: wxid,
                data: {
                    thing1: {
                        value: '退款成功'
                    },
                    thing2: {
                        value: '退款时间'
                    },
                    thing3: {
                        value: '退款人'
                    },
                    thing4: {
                        value: '退款人电话'
                    },
                    thing5: {
                        value: '退款人地址'
                    },
                    thing6: {
                        value: '退款人宠物'
                    },
                }
            })

            // 4. 发送微信通知

        } else {
            throw new Error("接受微信支付失败");
        }
        req.response.success("接受微信支付/退款回调成功", event_type);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;