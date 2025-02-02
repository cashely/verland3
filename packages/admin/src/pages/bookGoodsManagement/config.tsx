import { Space, Typography, Button, Modal } from "antd";
import { NavLink } from 'react-router-dom'
const searchConfig = [
    {
        label: '服务名称',
        prop: 'title',
        type: 'input',
        placeholder: '请输入服务名称',
        options: [{
            label: '服务名称1',
            value: '1'
        },
        {
            label: '服务内容2',
            value: '2'
        },
        ]
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
        title: '服务名称',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left'
    },
    {
        title: '服务内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '服务价格',
        dataIndex: 'price',
        key: 'price'
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
        title: '殡葬服务', //套餐类型
        content: '殡葬仪式', //上门时间
        price: 10000,   //是否需要快递
    },
];


export {
    searchConfig,
    tableColumns,
    tableDataSource
}