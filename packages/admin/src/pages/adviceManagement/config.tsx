import { Space, Typography, Button, Modal } from "antd";
import { NavLink } from 'react-router-dom'
import { COMPLAINT_TYPE } from '@/constants'
import { getLabelByValue } from "../../constants";
const searchConfig = [
    {
        label: '投诉建议类型',
        prop: 'type',
        type: 'select',
        placeholder: '请选择服务类型',
        options: COMPLAINT_TYPE
    },
]

const handleDel = () => {
    Modal.warning({
        title: '提示',
        content: '确定删除吗？',
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk() {
            console.log('OK');
        },
        onCancel() {
            console.log('Cancel');
        },
    })
}
const tableColumns = [
    {
        title: '投诉类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render(_) {
            return getLabelByValue(COMPLAINT_TYPE, _)
        }
    },
    {
        title: '投诉内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (_, record) => {
            const route = `/bookGoodsManagement/detail/${record.id}`
            return <Space size="middle">
                <NavLink to={route}>详情</NavLink>
                <a onClick={handleDel}>删除</a>
                {/* <Typography.Link>删除</Typography.Link> */}
                {/* <Link to="/" component={Typography.Link} /> */}
            </Space>
        },
    }
]

const tableDataSource = [
    {
        id: '1',
        key: '1',
        type: 1,
        content: '我要投诉你',
    },
];


export {
    searchConfig,
    tableColumns,
    tableDataSource
}