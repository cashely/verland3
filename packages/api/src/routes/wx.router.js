import Router from "../middles/route";
import prisma from "../configs/prisma";
import payment from "../utils/wechat.pay.sdk";

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

router.post('/notify_url', async (req, res) => {
    try {

        const { resource } = req.body;

        const decodeResource = await payment.decodeResource(resource);

        console.log(decodeResource)

        const { transaction_id, amount, out_trade_no } = decodeResource;

        const book = await prisma.book.findFirst({
            where: {
                outTradeNo: out_trade_no
            }
        });

        if (!book) {
            res.status(400).json({
                message: '订单不存在',
                code: 'FAIL' 
            });
            return;
        }

        // 更新订单状态
        await prisma.book.update({
            where: {
                id: book.id
            },
            data: {
                transactionId: transaction_id,
                payAmount: amount.total,
                statu: 1
            }
        });
        res.status(200).json({
            message: '支付成功',
            code: 'SUCCESS'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            code: 'FAIL'
        });
    }
})

// 退款成功回调
router.post('/refund_notify_url', async (req, res) => {
    try {

        const { resource } = req.body;

        const decodeResource = await payment.decodeResource(resource);

        const { out_trade_no } = decodeResource; 
        const book = await prisma.book.findUnique({
            where: {
                id: out_trade_no
            } 
        })
        if (!book) {
            res.status(400).json({
                message: '订单不存在',
                code: 'FAIL'
            }); 
            return;
        }

        await prisma.book.update({
            where: {
                id: out_trade_no
            },
            data: {
                statu: 2
            } 
        })
        res.status(200).json({
            message: '退款成功',
            code: 'SUCCESS' 
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
            code: 'FAIL'
        }) 
    }
})



export default router;