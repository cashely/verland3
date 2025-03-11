import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Flex } from "antd";
import { searchItems, tableColumns } from './config.ts'
import { list, del } from '@/apis/modules/ticket'
import MyPage from '@/components/BasicPage'


//发票
export default function TickManagement() {

  
    const navigate = useNavigate()


    const handleAdd = () => {
        navigate('/ticketManagement/editOrAdd')
    }

    useEffect(() => {
        // console.log(pageRef?.current)
        // pageRef?.current?.load()

    }, [])


    return (
        <MyPage
            pageApi={list}
            tableOptions={tableColumns}
            searchItems={searchItems}>
            {
                {
                    showColumnActions: (_, record) => {
                        const id = record.id
                        const detailRoute = `/bookGoodsManagement/detail/${id}`
                        const editRoute = `/bookGoodsManagement/editOrAdd/${id}`
                        return <Flex gap="small">
                            <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
                            <Button onClick={() => navigate(editRoute)} size="small" color="primary" variant="link">编辑</Button>
                        </Flex>
                    }
                }
            }
        </MyPage>
    );
}
