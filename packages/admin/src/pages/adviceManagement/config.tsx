import { COMPLAINT_TYPE } from '@/constants'
const searchItems = [
    {
        label: '投诉建议类型',
        prop: 'type',
        type: 'select',
        placeholder: '请选择服务类型',
        options: COMPLAINT_TYPE
    },
]

const tableColums = [
    {
        title: '投诉类型',
        key: 'type',
        width: 100,
        slot: 'select',
        options: COMPLAINT_TYPE
    },
    {
        title: '投诉内容',
        key: 'content',
    },
]


export {
    searchItems,
    tableColums,
}