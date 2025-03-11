import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Flex, } from "antd";
import { searchItems, tableColums } from './config.tsx'
import { list } from '@/apis/modules/advise'
import MyPage from '@/components/BasicPage'


export default function appointManagement() {

    const navigate = useNavigate()

    useEffect(() => {
        // console.log(pageRef?.current)
        // pageRef?.current?.load()

    }, [])


    return (
        <MyPage
            pageApi={list}
            tableOptions={tableColums}
            searchItems={searchItems}>
            {
                {
                    tableHeader:[{
                        label: '新增',
                        type:'primary',
                        onClick: () => navigate('/advice/editOrAdd')
                    }],
                    showColumnActions: (_, record) => {
                        const id = record.id
                        const detailRoute = `/advice/detail/${id}`
                        const editRoute = `/advice/editOrAdd/${id}`
                        return <Flex gap="small">
                            {/* <NavLink to={route}>详情</NavLink> */}
                            <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
                            <Button onClick={() => navigate(editRoute)} size="small" color="primary" variant="link">编辑</Button>
                        </Flex>
                    }
                }
            }
        </MyPage>
    );
}
