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
        prop: 'type',
        width: 100,
        options: COMPLAINT_TYPE,
        render(_: number) {
            return COMPLAINT_TYPE.find(item => item.value === _)?.label
        }
    },
    {
        title: '投诉内容',
        prop: 'content',
        key: 'content',
    },
    {
        title: '答复内容',
        prop: 'replayContent',
        key: 'replayContent',
    },
    {
        title: '答复时间',
        prop: 'replayAt',
        key: 'replayAt',
        slot: 'datetime'
    },
    {
        title: '投诉用户',
        prop: 'user',
        key: 'user',
    }, {
        title: '创建时间',
        prop: 'createdAt',
        key: 'createdAt',
        slot: 'datetime'
    }
]


export {
    searchItems,
    tableColums,
}