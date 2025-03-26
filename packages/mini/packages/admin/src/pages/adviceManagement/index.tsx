import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Flex, } from "antd";
import { searchItems, tableColums } from './config.tsx'
import { list } from '@/apis/modules/advise'
import MyPage from '@/components/BasicPage'


export default function appointManagement() {

  const navigate = useNavigate()

  return (
    <MyPage
      pageApi={list}
      tableOptions={tableColums}
      searchItems={searchItems}>
      {
        {
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
