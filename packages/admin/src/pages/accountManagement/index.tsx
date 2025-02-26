import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Flex } from "antd";
import { searchItems, tableColumns } from './config.ts'
import MyPage from "@/components/BasicPage";
import { list } from '@/apis/modules/user';

//用户
export default function accountManagement() {

  const navigate = useNavigate()

  return (
    <MyPage
      pageApi={list}
      tableOptions={tableColumns}
      searchItems={searchItems}>
      {
        {
          showColumnActions: (_, record) => {
            const id = record.id
            const detailRoute = `/bookGoodsManagement/detail/${id}`;
            return <Flex gap="small">
              <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
            </Flex>
          }
        }
      }
    </MyPage>
  );
}
