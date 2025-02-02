import { Space, Typography, Button, Modal } from "antd";
import { NavLink } from 'react-router-dom'
import { TICKET_TYPE } from '@/constants'
const searchConfig = [
    {
        label: '发票类型',
        prop: 'type',
        type: 'select',
        placeholder: '请选择发票类型',
        options: TICKET_TYPE
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
        title: '发票抬头',
        dataIndex: 'header',
        key: 'header',
        fixed: 'left'
    },
    {
        title: '发票类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '附加服务',
        dataIndex: 'book',
        key: 'book',
    },
    {
        title: '税号',
        dataIndex: 'number',
        key: 'number'
    },
    {
        title: '发票金额',
        dataIndex: 'amount',
        key: 'amount'
    },
    {
        title: '开票状态',
        dataIndex: 'statu',
        key: 'statu',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (_, record) => {
            const route = `/ticketManagement/detail/${record.id}`
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
        header: '殡葬服务',
        type: '殡葬仪式',
        book: '服务',
        number: '123456789',
        amount: 10000,
        statu: '已开票',
        email: 'EMAIL'
    },
];


export {
    searchConfig,
    tableColumns,
    tableDataSource
}