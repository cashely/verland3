import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import { searchItems, tableColumns } from './config.ts';
import { list } from '@/apis/modules/ticket';
import MyPage from '@/components/BasicPage';

//发票
export default function TickManagement() {
  const navigate = useNavigate();

  return (
    <MyPage
      pageApi={list}
      tableOptions={tableColumns}
      searchItems={searchItems}
    >
      {{
        showColumnActions: (_, record) => {
          const id = record.id;
          const detailRoute = `/ticketManagement/detail/${id}`;
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
