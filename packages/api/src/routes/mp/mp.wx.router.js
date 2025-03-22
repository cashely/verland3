import Router from "../../middles/route";
import prisma from "../../configs/prisma";
import payment from "../../utils/wechat.pay.sdk";

const router = new Router({
    auth: true
});

router.post('/prepay', async (req, res) => {
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

        if (book) {
            const { totalAmount, id: bookId, user } =  book;
            let result = await payment.jsapi({
                description: '它念预约支付',
                out_trade_no: bookId,
                amount: {
                    total: totalAmount
                },
                payer: {
                    openid: user.wxid
                },
            })
            // 微信支付返回
            // prepay_id是返回给前台下单
            // {
            //     "prepay_id": "wx201410272009395522657a690389285100"
            // }
            res.response.success(result);
        } else {
            throw new Error('订单不存在');
        }
    } catch (error) {
        res.response.error(error);
    }
})

router.post('/pay', async (req, res) => {
    try {
        const { prepay_id } = req.body;

        let timeStamp = Math.floor(Date.now() / 1000);

        const signParams = [
            `appid=${payment.appid}`,
            `timeStamp=${timeStamp}`,
            `nonceStr=${payment.generate()}`,
            `package=prepay_id=${prepay_id}`,
        ];

        const signature = payment.rsaSign(`${signParams.join('\n')}\n`, payment.private_key, 'SHA256withRSA');

        res.response.success({
            appid: payment.appid,
            timeStamp,
            nonceStr: payment.generate(),
            package: `prepay_id=${prepay_id}`,
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
router.post('/refund/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({
            where: {
                id
            } 
        });

        if (!book) {
            throw new Error('订单不存在');
        }

        const { transactionId } = book;
        const refundResult = await payment.refund({
            transaction_id: transactionId,
            out_refund_no: id,
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
                statu: 6
            } 
        });

        res.response.success(refundResult);
    } catch (error) {
        res.response.error(error);
    }
})

export default router;