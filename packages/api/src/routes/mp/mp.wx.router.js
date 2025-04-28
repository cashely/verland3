import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import payment from "../../utils/wechat.pay.sdk";
import validate from "../../utils/validate";

const router = new Router({
    auth: true
});

router.post('/prepay', validate(z => (
    z.object({
        body: z.object({
            bookId: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        // 订单id
        const { bookId: id } = req.body;
        // 根据订单id查询订单详情
        const book = await prisma.book.findUnique({
            where: {
                id
            },
            include: {
                user: true
            }
        });

        // 查询当前订单的预约时间是否已经存在有预约成功的订单
        if (book.bookDateTime) {
            const bookCount = await prisma.book.count({
                where: {
                    bookDateTime: {
                        equals: book.bookDateTime
                    },
                    statu: 1,
                }
            });
            if (bookCount >= 1) {
                throw new Error('当前时间段预约人数已满');
            }
        }

        const outTradeNo = String(+new Date());

        if (book) {
            const { totalAmount, id: bookId, user } =  book;
            let result = await payment.jsapi({
                description: '它念预约支付',
                out_trade_no: outTradeNo,
                amount: {
                    total: totalAmount
                },
                payer: {
                    openid: user.wxid
                },
            });
            
            if (result.status !== 200) {
                throw new Error('生成prepay_id失败');
            }

            await prisma.book.update({
                where: {
                    id: bookId
                },
                data: {
                    outTradeNo,
                } 
            })
            // 微信支付返回
            // prepay_id是返回给前台下单
            // {
            //     "prepay_id": "wx201410272009395522657a690389285100"
            // }
            res.response.success(JSON.parse(result.data));
        } else {
            throw new Error('订单不存在');
        }
    } catch (error) {
        res.response.error(error);
    }
})

router.post('/pay', validate(z => (
    z.object({
        body: z.object({
            prepayId: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { prepayId } = req.body;

        const timeStamp = String(Math.floor(Date.now() / 1000));
        
        const nonceStr = payment.generate();

        // console.log(`${payment.appid}\n${timeStamp}\n${payment.generate()}\nprepay_id=${prepayId}\n`, '<<<<')

        const signatureStr = `${payment.appid}\n${timeStamp}\n${nonceStr}\nprepay_id=${prepayId}\n`;

        // payment.rsaSign(`${appid}\n${timestamp}\n${noncestr}\n${pkg}\n`, private_key, 'SHA256withRSA')

        // let buff = Buffer.from(signature);
        const signature = payment.rsaSign(signatureStr, payment.private_key);

        let buff = Buffer.from(signature);
        let base64data = buff.toString('base64');

        console.log(signature, '<<<<')
        res.response.success({
            appid: payment.appid,
            timeStamp,
            nonceStr,
            package: `prepay_id=${prepayId}`,
            signType: 'RSA',
            paySign: signature
        });
        
    } catch (error) {
        res.response.error(error);
    }
    
})

/**
 * 退款
 */
router.post('/refund/:bookId', validate(z => (
    z.object({
        params: z.object({
            bookId: z.string().min(1)
        })
    })
)), async (req, res) => {
    try {
        const { bookId: id } = req.params;
        const book = await prisma.book.findUnique({
            where: {
                id,
            } 
        });

        if (!book) {
            throw new Error('订单不存在');
        }

        if (book.statu !== 1) {
            throw new Error('订单状态不正确，不支持退款');
        }

        const { transactionId } = book;
        const outRefundNo = String(+new Date());
        const refundResult = await payment.refund({
            transaction_id: transactionId,
            out_refund_no: outRefundNo,
            amount: {
                total: book.payAmount,
                refund: book.payAmount,
                currency: 'CNY',
            },
        });

        await prisma.book.update({
            where: {
                id
            },
            data: {
                statu: 6,
                outRefundNo,
            }
        });

        res.response.success(refundResult);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;