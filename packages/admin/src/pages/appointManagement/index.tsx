import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, message, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { searchItems, tableColumns } from './config.tsx';
// Bug 修复：添加 @types 声明文件
import { list, edit } from '@/apis/modules/book';
import MyPage from '@/components/BasicPage';

//发票
export default function TickManagement() {
  const navigate = useNavigate();
  const handleChangeStatu = (id: string, statu: number) => {
    edit(id, statu).then((res) => {
      if (res?.code === 200) {
        message.success('操作成功');
      }
    });
  };

  const handleItems = (record: any) => {
    const statu = record.statu;
    const id = record.id;
    const items = [];
    if (statu === 1) {
      items.push({
        key: '2',
        label: (
          <Button
            onClick={() => handleChangeStatu(id, 2)}
            size="small"
            color="primary"
            variant="link"
          >
            完成预约
          </Button>
        ),
      });
    }
    if (statu === 2) {
      items.push({
        key: '3',
        label: (
          <Button
            onClick={() => handleChangeStatu(id, 3)}
            size="small"
            color="primary"
            variant="link"
          >
            完成寄送
          </Button>
        ),
      });
    }
    return items.length ? (
      <Dropdown
        menu={{
          items,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Typography.Link>更多</Typography.Link>
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    ) : null;
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
