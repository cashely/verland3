import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import { searchItems, tableColumns } from './config.ts';
import MyPage from '@/components/BasicPage';
import { list, listCount } from '@/apis/modules/user';

//用户
export default function accountManagement() {
  const navigate = useNavigate();

  return (
    <MyPage
      pageApi={list}
      pageCountApi={listCount}
      tableOptions={tableColumns}
      searchItems={searchItems}
    >
      {{
        showColumnActions: (_, record) => {
          const id = record.id;
          const detailRoute = `/accountManagement/detail/${id}`;
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
