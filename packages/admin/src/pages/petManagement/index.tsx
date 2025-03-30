import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import { searchItems, tableColumns } from './config.tsx';
import { list } from '@/apis/modules/pet.ts';
import MyPage from '@/components/BasicPage';

//发票
export default function TickManagement() {
  const navigate = useNavigate();
  const pageRef = useRef<null>();
  return (
    <MyPage
      pageApi={list}
      tableOptions={tableColumns}
      ref={pageRef}
      searchItems={searchItems}
    >
      {{
        showColumnActions: (_, record) => {
          const id = record.id;
          const detailRoute = `/petManagement/detail/${id}`;

          return (
            <Flex gap="small">
              <Button
                onClick={() => navigate(detailRoute)}
                size="small"
                color="primary"
                variant="link"
              >
                详情
              </Button>
            </Flex>
          );
        },
      }}
    </MyPage>
  );
}
