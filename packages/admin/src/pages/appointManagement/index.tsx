import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { searchItems, tableColumns } from './config.tsx';
import { list, edit } from '@/apis/modules/book';
import MyPage from '@/components/BasicPage';

//发票
export default function TickManagement() {
  const navigate = useNavigate();

  const pageRef = useRef<null>();

  const handleChangeStatu = (id: string, data = {}) => {
    edit(id, data).then((res) => {
      if (res?.code === 200) {
        message.success('操作成功');
        pageRef.current?.load();
      }
    });
  };

  // const handleItems = (record: any) => {
  //   const statu = record.statu;
  //   const id = record.id;
  //   const items = [];
  //   if (statu === 1) {
  //     items.push({
  //       key: '2',
  //       label: (
  //         <Button
  //           onClick={() => handleChangeStatu(id, { statu: 2 })}
  //           size="small"
  //           color="primary"
  //           variant="link"
  //         >
  //           完成预约
  //         </Button>
  //       ),
  //     });
  //   }
  //   if (statu === 2) {
  //     items.push({
  //       key: '3',
  //       label: (
  //         <Button
  //           onClick={() => handlePost(id, 3)}
  //           size="small"
  //           color="primary"
  //           variant="link"
  //         >
  //           完成寄送
  //         </Button>
  //       ),
  //     });
  //   }
  //   return items.length ? (
  //     <Dropdown
  //       menu={{
  //         items,
  //       }}
  //     >
  //       <a onClick={(e) => e.preventDefault()}>
  //         <Space>
  //           <Typography.Link>更多</Typography.Link>
  //           <DownOutlined />
  //         </Space>
  //       </a>
  //     </Dropdown>
  //   ) : null;
  // };

  return (
    <>
      <MyPage
        ref={pageRef}
        pageApi={list}
        tableOptions={tableColumns}
        searchItems={searchItems}
      >
        {{
          showColumnActions: (_, record: any) => {
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
                {record.statu === 1 && (
                  <Button
                    onClick={() => handleChangeStatu(record.id, { statu: 2 })}
                    size="small"
                    color="primary"
                    variant="link"
                  >
                    完成预约
                  </Button>
                )}
                {record.statu === 2 && (
                  <Button
                    onClick={() =>
                      handleChangeStatu(record.id, {
                        statu: 3,
                      })
                    }
                    size="small"
                    color="primary"
                    variant="link"
                  >
                    完成处理
                  </Button>
                )}
              </>
            );
          },
        }}
      </MyPage>
    </>
  );
}
