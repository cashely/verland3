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
        fixed: 'left'
    },
    {
        title: '发票类型',
        key: 'type',
    },
    {
        title: '附加服务',
        key: 'book',
    },
    {
        title: '税号',
        key: 'number'
    },
    {
        title: '发票金额',
        key: 'amount'
    },
    {
        title: '开票状态',
        key: 'statu',
    },
    {
        title: '邮箱',
        key: 'email'
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