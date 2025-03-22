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
        title: 'ID',
        key: 'petId',
        prop: 'petId',
        fixed: 'left'
    },
    {
        title: '宠物名称',
        key: 'pet',
        prop: 'pet'
    },
    {
        title: '缩略图',
        key: 'image',
        prop: 'image'
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