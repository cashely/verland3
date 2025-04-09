import dayjs from 'dayjs';
import payment from '../utils/wechat.pay.sdk';
import Router from "../middles/route";
import prisma from "../configs/prisma";
import { sendTemplateMessage } from "../utils/wechat.helper";
import wxConfig from '../configs/wx.config';
import validate from '../utils/validate';

const router = new Router();

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


// 解密支付成功的结果
// {
//     "sp_appid" : "wx8888888888888888",
//     "sp_mchid" : "1230000109",
//     "sub_appid" : "wxd678efh567hg6999",
//     "sub_mchid" : "1900000109",
//     "out_trade_no" : "1217752501201407033233368018",
//     "transaction_id" : "1217752501201407033233368018",
//     "trade_type" : "JSAPI",
//     "trade_state" : "SUCCESS",
//     "trade_state_desc" : "支付失败，请重新下单支付",
//     "bank_type" : "CMC",
//     "attach" : "自定义数据",
//     "success_time" : "2018-06-08T10:34:56+08:00",
//     "payer" : {
//       "sp_openid" : "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o\t",
//       "sub_openid" : "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o\t"
//     },
//     "amount" : {
//       "total" : 100,
//       "payer_total" : 100,
//       "currency" : "CNY",
//       "payer_currency" : "CNY"
//     },
//     "scene_info" : {
//       "device_id" : "013467007045764"
//     },
//     "promotion_detail" : [
//       {
//         "coupon_id" : "109519",
//         "name" : "单品惠-6",
//         "scope" : "GLOBAL",
//         "type" : "CASH",
//         "amount" : 100,
//         "stock_id" : "931386",
//         "wechatpay_contribute" : 0,
//         "merchant_contribute" : 0,
//         "other_contribute" : 0,
//         "currency" : "CNY",
//         "goods_detail" : [
//           {
//             "goods_id" : "M1006",
//             "quantity" : 1,
//             "unit_price" : 100,
//             "discount_amount" : 1,
//             "goods_remark" : "商品备注信息"
//           }
//         ]
//       }
//     ]
//   }

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
            console.log('收到微信支付通知', payResult)
            // 2. 更新订单状态
            const { out_trade_no, amount: { payer_total }, transaction_id: transactionId } = payResult;

            const book = await prisma.book.findFirst({
                where: {
                    outTradeNo: out_trade_no
                },
                include: {
                    menu: true 
                }
            })

            if (!book) {
                throw new Error("订单不存在");
            }

            const updateBook = await prisma.book.update({
                where: {
                    id: book.id
                },
                data: {
                    payAmount: payer_total,
                    transactionId,
                    statu: 1 // 已预约
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
                    // 商品·
                    thing1: {
                        value: '预约成功'
                    },
                    // 金额
                    amount2: {
                        value: `¥ ${book.totalAmount / 100}`
                    },
                    // 时间
                    date3: {
                        value: dayjs(book.createdAt).format('YYYY-MM-DD HH:mm')
                    },
                    // 订单编号
                    character_string8: {
                        value: out_trade_no
                    }
                },
                url: `pages/mine/appointList/detail/index?id=${updateBook.id}`
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
            console.log('收到微信退款通知', refundResult)
            const { out_refund_no } = refundResult;

            const book = await prisma.book.findFirst({
                where: {
                    outRefundNo: out_refund_no
                },
                include: {
                   menu: true 
                }
            })

            if (!book) {
                throw new Error("订单不存在");
            }

            // 2. 更新订单状态
            const updateBook = await prisma.book.update({
                where: {
                    id: book.id
                },
                data: {
                    statu: 4 // 已退款
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
                    // 退款状态
                    phrase1: {
                        value: '退款成功'
                    },
                    // 订单时间
                    character_string2: {
                        value: out_refund_no
                    },
                    // 商品名称
                    thing3: {
                        value: book.menu.name
                    },
                    // 退款金额
                    amount4: {
                        value: book.payAmount / 100
                    }
                }
            })

            // 4. 发送微信通知

        } else {
            throw new Error("接受微信支付失败");
        }
        res.response.success("接受微信支付/退款回调成功", event_type);
    } catch (error) {
        res.response.error(error);
    }
})

// 查询退款状态
router.get('/wxpay/refundStatu/:outRefundNo', validate(z => (
    z.object({
        params: z.object({
            outRefundNo: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { outRefundNo } = req.params;
        const refundResult = await payment.getRefund({ out_refund_no: outRefundNo });
        res.response.success(refundResult);
    } catch (error) {
        res.response.error(error); 
    } 
})

// 关闭订单
router.post('/wxpay/closeOrder', validate(z => (
    z.object({
        body: z.object({
            outTradeNo: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { outTradeNo } = req.body;
        const closeResult = await payment.close({ out_trade_no: outTradeNo });
        res.response.success(closeResult);
    } catch (error) {
        res.response.error(error);
    }
})



export default router;