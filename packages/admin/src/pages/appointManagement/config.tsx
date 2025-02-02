import { Space, Typography, Button, Modal } from "antd";
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
        title: '套餐类型',
        dataIndex: 'menu',
        key: 'menu',
        fixed: 'left'
    },
    {
        title: '预约上门时间',
        dataIndex: 'bookDateTime',
        key: 'bookDateTime',
    },
    {
        title: '是否需要快递',
        dataIndex: 'isExpress',
        key: 'isExpress',
        render(_) {
            return _ === 1 ? '是' : '否'
        }
    },
    {
        title: '快递时间',
        dataIndex: 'expressDateTime',
        key: 'expressDateTime',
    },
    {
        title: '快递地址',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '是否需要仪式',
        dataIndex: 'isRite',
        key: 'isRite',
        render(_) {
            return _ === 1 ? '是' : '否'
        }
    },
    {
        title: '仪式时间',
        dataIndex: 'riteDateTIme',
        key: 'riteDateTIme',
    },
    {
        title: '总金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
    },
    {
        title: '付款金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
    },
    {
        title: '付款渠道',
        dataIndex: 'payChannel',
        key: 'payChannel',
        render(_: number) {
            return _ === 1 ? '微信' : '支付宝'
        }
    },
    {
        title: '订单来源渠道',
        dataIndex: 'channel',
        key: 'channel',
        render(_: number) {
            return _ === 1 ? '平台' : '小程序'
        }
    },
    {
        title: '付款状态',
        dataIndex: 'statu',
        key: 'statu',
        render(_: number) {
            return _ === 0 ? '未付款' : '已付款'
        }
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (_, record) => {
            const route = `/appointManagement/detail/${record.id}`
            return <Space size="middle">
                <NavLink to={`/appointManagement/editAdd/${record.id}`}>编辑</NavLink>
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
        menu: 'John Brown', //套餐类型
        bookDateTime: 32, //上门时间
        isExpress: 1,   //是否需要快递
        expressDateTime: '快递时间',
        address: '',
        isRite: 1,  //是否需要仪式
        riteDateTIme: '',  //仪式时间
        totalAmount: "",  //总金额
        payAmount: "",   //付款金额
        payChannel: 1,  //付款渠道 微信1  支付宝2
        channel: 1,  //订单渠道来源   1平台  2小程序
        statu: 0,  //0未付款
        user: "" //下单用户
    },
    {
        id: '2',
        key: '2',
        menu: 'John Brown', //套餐类型
        bookDateTime: 32, //上门时间
        isExpress: 1,   //是否需要快递
        expressDateTime: '快递时间',
        address: '',
        isRite: 2,  //是否需要仪式
        riteDateTIme: '',  //仪式时间
        totalAmount: "",  //总金额
        payAmount: "",   //付款金额
        payChannel: 1,  //付款渠道 微信1  支付宝2
        channel: 1,  //订单渠道来源   1平台  2小程序
        statu: 0,  //0未付款
        user: "" //下单用户
    },
    {
        id: '3',
        key: '3',
        menu: 'John Brown', //套餐类型
        bookDateTime: 32, //上门时间
        isExpress: 1,   //是否需要快递
        expressDateTime: '快递时间',
        address: '',
        isRite: 1,  //是否需要仪式
        riteDateTIme: '',  //仪式时间
        totalAmount: "",  //总金额
        payAmount: "",   //付款金额
        payChannel: 1,  //付款渠道 微信1  支付宝2
        channel: 1,  //订单渠道来源   1平台  2小程序
        statu: 0,  //0未付款
        user: "" //下单用户
    },
];


export {
    searchConfig,
    tableColumns,
    tableDataSource
}