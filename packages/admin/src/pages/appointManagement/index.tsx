import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { searchItems, tableColumns } from './config.ts';
// Bug 修复：添加 @types 声明文件
import { list } from '@/apis/modules/book';
import MyPage from '@/components/BasicPage';

//发票
export default function TickManagement() {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(pageRef?.current)
    // pageRef?.current?.load()
  }, []);

  const handleItems = (record) => {
    const id = record.id;

    return (
      <Dropdown
        menu={{
          items: [
            {
              key: '2',
              label: (
                <Button
                  onClick={() => navigate(detailRoute)}
                  size="small"
                  color="primary"
                  variant="link"
                >
                  完成预约
                </Button>
              ),
            },
            {
              key: '3',
              label: (
                <Button
                  onClick={() => navigate(detailRoute)}
                  size="small"
                  color="primary"
                  variant="link"
                >
                  完成寄送
                </Button>
              ),
            },
          ],
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            更多
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    );
  };

  return (
    <MyPage
      pageApi={list}
      tableOptions={tableColumns}
      searchItems={searchItems}
    >
      {{
        showColumnActions: (_, record) => {
          const detailRoute = `/appointManagement/detail/${record.id}`;
          return (
            <>
              <Button
                onClick={() => navigate(detailRoute)}
                size="small"
                color="primary"
                variant="link"
              >
                详情
              </Button>
              {handleItems(record)}
            </>
          );
        },
      }}
    </MyPage>
  );
}
