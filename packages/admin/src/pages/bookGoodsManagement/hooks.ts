import { Space, Typography, Button, Image, Modal, Flex, message } from "antd";
import { NavLink } from 'react-router-dom'
import { timeFormatDateTime } from '@/utils/timeUtils'
import { del } from '@/apis/modules/bookGood'
import { useEffect, useState } from 'react'
import { produce } from 'immer'
const searchConfig = [
    {
        label: '产品名称',
        prop: 'title',
        type: 'input',
        placeholder: '请输入服务名称',
        options: [{
            label: '产品名称1',
            value: '1'
        },
        {
            label: '产品内容2',
            value: '2'
        },
        ]
    },
]

const handleDel = (id: string) => {
    Modal.confirm({
        title: '提示',
        content: '确定删除吗？',
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk() {
            console.log('OK');
            del(id).then(res => {
                console.log(res, '+++')
                message.success('删除成功')
            })
        },
        onCancel() {
            console.log('Cancel');
        },
    })
}
const tableColumns = [
    {
        title: '产品名称',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        // width: '120',
        // fixed: 'left',
        // type: 'slot',
    },
    {
        title: '缩略图',
        dataIndex: 'thumb',
        key: 'thumb',
        render(val: string) {
            return val ? <Image src={ val } alt = "缩略图" width = { 100} height = { 100} /> : '-'
        }
    },
    {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: '产品内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render(val: string) {
            return timeFormatDateTime(val) || '-'
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (_, record) => {
            const route = `/bookGoodsManagement/detail/${record.id}`
            return <Flex gap="small" >
                <NavLink to={ route }> 详情 < /NavLink>
            </Flex>
        },
    }
]


const useForm = ({ getList }) => {
    
    const [data, setData] = useState([])


    useEffect(() => {
        if (getList) {
            getList().then(res => {
                setData(
                    produce((draft) => [...draft, ...res.data])
                );
            })
        }
    }, [])


    return {
        searchConfig,
        tableColumns,
        data,
    }
}

