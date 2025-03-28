import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Flex, Dropdown } from "antd";
import { searchItems, tableColumns } from './config.ts'
// Bug 修复：添加 @types 声明文件
import { list } from '@/apis/modules/book';
import MyPage from '@/components/BasicPage'


//发票
export default function TickManagement() {

    const navigate = useNavigate()

    useEffect(() => {
        // console.log(pageRef?.current)
        // pageRef?.current?.load()
    }, [])

    const handleItems = (record) => {
        const id = record.id
        const detailRoute = `/appointManagement/detail/${id}`
        return (
            <Dropdown
                items={[
                    {
                        key: '0',
                        label: (
                            <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
                        )
                    },
                    {
                        key: '1',
                        label: (
                            <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">完成预约</Button>
                        ) 
                    },
                    {
                        key: '2',
                        label: (
                            <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">完成寄送</Button>
                        )
                    }
                ]}
            >
            </Dropdown>
        )
    }


    return (
        <MyPage
            pageApi={list}
            tableOptions={tableColumns}
            searchItems={searchItems}>
            {
                {
                    showColumnActions: (_, record) => {
                        return (
                            // <Flex gap="small">
                            //     <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
                            //     <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">完成预约</Button>
                            //     <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">完成寄送</Button>
                            // </Flex>
                            handleItems(record)
                        )
                    }
                }
            }
        </MyPage>
    );
}
