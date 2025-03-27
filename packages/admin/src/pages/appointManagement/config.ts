import { HANDLE_WAYS, SERVICE_TYPE, RITE_TYPE } from '@/constants'
const searchItems = [
    {
        label: '姓名',
        prop: 'name',
        type: 'input',
        placeholder: '请输入姓名'
    },
    {
        label: '手机号',
        prop: 'phone',
        type: 'input',
        placeholder: '请输入手机号',
        itemProps: {
            // disabled: true,
            allowClear: false
        }
    },
    {
        label: '年龄',
        prop: 'age',
        type: 'inputNumber',
        placeholder: '请输入年龄',
        itemProps: {
            // disabled: true,
            // allowClear: false
        }
    },
    {
        label: '性别',
        prop: 'sex',
        type: 'select',
        placeholder: '请选择性别',
        options: [{
            label: '男',
            value: 1
        }, {
            label: '女',
            value: 2
        }]
    },
]

const tableColumns = [
    {
        title: '套餐类型',
        key: 'menu',
        dataIndex: 'menu',
        fixed: 'left',
        render(_: number) {
            if (!_) return;
            return SERVICE_TYPE.find((item) => item.value === _)?.label || '-'
        }
    },
    {
        title: '预约上门时间',
        dataIndex: 'bookDateTime',
        slot: 'datetime'
    },
    {
        title: '遗物处理方式',
        dataIndex: 'handleWay',
        render(_: number) {
            if (!_) return;
            return HANDLE_WAYS.find(item => item.value === _)?.label || '-'

        }
    },
    {
        title: '遗物处理时间',
        dataIndex: 'handleDateTime',
        key: 'handleDateTime',
        slot: "datetime"
    },
    {
        title: '快递地址',
        key: 'address',
        dataIndex: 'address',
        render(_) {
            return `${_.province || ''}${_.city || ''}${_.area || ''}${_.detail || ''}`
        }
    },
    {
        title: '是否需要仪式',
        dataIndex: 'isRite',
        render(_) {
            if (!_) return '-'
            return RITE_TYPE.find(item => item.value === _)?.label || '-'
        }
    },
    {
        title: '仪式时间',
        dataIndex: 'riteDateTime',
        key: 'riteDateTime',
        slot: "datetime"
    },
    {
        title: '总金额（元）',
        key: 'totalAmount',
        dataIndex: 'totalAmount',
        render(_) {
            if (!Number.isInteger(_)) return '-'
            return (_ / 100).toLocaleString()
        }
    },
    {
        title: '付款金额（元）',
        dataIndex: 'payAmount',
        key: 'payAmount',
        render(_) {
            if (!Number.isInteger(_)) return '-'
            return (_ / 100).toLocaleString()
        }
    },
    {
        title: '付款渠道',
        key: 'payChannel',
        dataIndex: 'payChannel',
        render(_: number) {
            return _ === 1 ? '微信' : '支付宝'
        }
    },
    {
        title: '订单来源渠道',
        key: 'channel',
        dataIndex: 'channel',
        render(_: number) {
            return _ === 1 ? '平台' : '小程序'
        }
    },
    {
        title: '付款状态',
        key: 'statu',
        dataIndex: 'statu',
        render(_: number) {
            // 待付款  已预约  待寄送  已完成  已取消
            switch (_) {
                case 0:
                    return '待付款'
                case 1:
                    return '已预约'
                case 2:
                    return '待寄送'
                case 3:
                    return '已完成'
                case 4:
                    return '已取消'
            }
        }
    },
]




const detailItems = [
    {
        label: '套餐类型',
        prop: 'menu',
        render(_) {
            if (!_) return;
            return _ === 1 ? '上门服务' : '预约服务'
        }
    },
    {
        label: '预约上门时间',
        prop: 'bookDateTime',
        type: 'datetime'
    },
    {
        label: '是否需要快递',
        prop: 'handleWay',
        render(_) {
            if (!_) return '-';
            return HANDLE_WAYS.find(_ => _.value === _)?.label || '-'
        }
    },
    {
        label: '快递时间',
        prop: 'handleDateTime',
        type: "datetime"
    },
    {
        label: '快递地址',
        prop: 'address',
        render(_) {
            if (!_) return;
            return `${_.province || ''}${_.city || ''}${_.area || ''}${_.detail || ''}`
        }
    },
    {
        label: '是否需要仪式',
        prop: 'isRite',
        render(_) {
            return _ === 1 ? '是' : '否'
        }
    },
    {
        label: '仪式时间',
        prop: 'riteDateTime',
        type: "datetime"
    },
    {
        label: '总金额（元）',
        prop: 'totalAmount',
        type: 'price'
    },
    {
        label: '付款金额（元）',
        prop: 'payAmount',
        type: 'price'
    },
    {
        label: '付款渠道',
        prop: 'payChannel',
        render(_: number) {
            return _ === 1 ? '微信' : '支付宝'
        }
    },
    {
        label: '订单来源渠道',
        prop: 'channel',
        render(_: number) {
            return _ === 1 ? '平台' : '小程序'
        }
    },
    {
        label: '付款状态',
        prop: 'statu',
        render(_: number) {
            // 待付款  已预约  待寄送  已完成  已取消
            switch (_) {
                case 0:
                    return '待付款'
                case 1:
                    return '已预约'
                case 2:
                    return '待寄送'
                case 3:
                    return '已完成'
                case 4:
                    return '已取消'
            }
        }
    },
]


export {
    searchItems,
    tableColumns,
    detailItems
}