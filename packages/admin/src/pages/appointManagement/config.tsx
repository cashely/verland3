import { Space } from "antd";
import { NavLink } from 'react-router-dom'
const searchConfig = [
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
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
            const route = `/appointManagement/detail/${record.id}`
            return <Space size="middle">
                <NavLink to={`/appointManagement/editAdd/${record.id}`}>编辑</NavLink>
                <NavLink to={route}>详情</NavLink>
            </Space>
        },
    }
]

const tableDataSource = [
    {
        id: '1',
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        id: '2',
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        id: '3',
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];


export {
    searchConfig,
    tableColumns,
    tableDataSource
}