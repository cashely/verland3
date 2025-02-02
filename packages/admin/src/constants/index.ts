//发票类型
const TICKET_TYPE = [{
    label: '个人',
    value: 1
},
{
    label: '公司',
    value: 2
}]
//宠物状态
const PET_STATUS = [
    {
        label: '活着',
        value: 1
    },
    {
        label: '死亡',
        value: 2
    },
]
//付款渠道
const PAY_CHANNEL = [
    {
        label: '微信',
        value: 1
    },
    {
        label: '支付宝',
        value: 2
    },
    {
        label: '银行卡',
        value: 3
    },
    {
        label: '现金',
        value: 4
    },
]
//订单渠道来源
const ORDER_CHANNEL = [
    {
        label: '平台',
        value: 1
    },
]
//开票状态
const INVOICE_STATUS = [
    {
        label: '未开票',
        value: 1
    },
    {
        label: '已开票',
        value: 2
    },
]
//投诉建议类型
const COMPLAINT_TYPE = [
    {
        label: '建议',
        value: 1
    },
    {
        label: '投诉',
        value: 2
    },
]

function getLabelByValue(arr: any[], value: any) {
    let label = ''
    arr.forEach(item => {
        if (item.value === value) {
            label = item.label
        }
    })
    return label
}
export {
    TICKET_TYPE,
    PET_STATUS,
    PAY_CHANNEL,
    ORDER_CHANNEL,
    INVOICE_STATUS,
    COMPLAINT_TYPE,
    getLabelByValue
}