import { TICKET_TYPE } from '@/constants'
const searchItems = [
    {
        label: '发票类型',
        prop: 'type',
        type: 'select',
        placeholder: '请选择发票类型',
        options: TICKET_TYPE
    },
]

const tableColumns = [
    {
        title: '发票抬头',
        key: 'header',
        prop: 'header',
    },
    {
        title: '发票类型',
        key: 'type',
        prop: "type",
        render(_) {
            return _ === '1' ? '个人' : '企业'
        }
    },
    {
        title: '附加服务',
        key: 'book',
        prop: 'book'
    },
    {
        title: '税号',
        key: 'number',
        prop: 'number'
    },
    {
        title: '发票金额',
        key: 'amount',
        prop: 'amount',
        render(_) {
            if (!_) return '-'
            return (_ / 100).toLocaleString()
        }
    },
    {
        title: '开票状态',
        key: 'statu',
        prop: 'statu',
        render(_) {
            return _ === '2' ? '未开票' : '已开票'
        }
    },
    {
        title: '邮箱',
        key: 'email',
        prop: 'email'
    },
    {
        title: '开票时间',
        key: 'createdAt',
        prop: 'createdAt',
        slot: 'datetime'
    },
    {
        title: '操作',
        key: 'action',
    }
]

const detailItems = [
    {
        label: '产品名称',
        prop: 'title',
    },
    {
        label: '缩略图',
        prop: 'thumnb',
    },
    {
        label: '价格',
        prop: 'price',
    },
    {
        label: '产品内容',
        prop: 'content',
    },
    {
        label: '创建时间',
        prop: 'createdAt',
    }
];


export {
    searchItems,
    tableColumns,
    detailItems
}