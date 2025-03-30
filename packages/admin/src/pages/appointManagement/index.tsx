import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, message, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { searchItems, tableColumns, formConfig } from './config.tsx';
import ModalForm from '@/components/ModalForm';
// Bug 修复：添加 @types 声明文件
import { list, edit } from '@/apis/modules/book';
import MyPage from '@/components/BasicPage';
import { produce } from 'immer';

//发票
export default function TickManagement() {
  const navigate = useNavigate();

  const pageRef = useRef<null>();
  const [modalConfig, setModalConfig] = useState({
    title: '编辑',
    isOpen: false,
    confirmLoading: false,
  });
  const [selectItems, setSelectItems] = useState({
    id: '',
    statu: -1,
  });
  const handlePost = (id: string, statu: number) => {
    setModalConfig(
      produce((draft) => {
        draft.isOpen = true;
        draft.title = '完成寄送';
        formConfig.formModel = {};
      })
    );
    setSelectItems({ id, statu });
  };
  const handleChangeStatu = (id: string, data = {}) => {
    edit(id, data).then((res) => {
      if (res?.code === 200) {
        message.success('操作成功');
        setModalConfig(
          produce((draft) => {
            draft.isOpen = false;
            formConfig.formModel = {};
          })
        );
        pageRef.current?.load();
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
            onClick={() => handleChangeStatu(id, { statu: 2 })}
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
            onClick={() => handlePost(id, 3)}
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

  const handleOk = async (values: any) => {
    handleChangeStatu(selectItems.id, {
      statu: selectItems.statu,
      ...values,
    });
    setModalConfig(
      produce((draft) => {
        draft.confirmLoading = true;
      })
    );
  };

  return (
    <>
      <MyPage
        ref={pageRef}
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
      <ModalForm {...modalConfig} formConfig={formConfig} onOk={handleOk}>
        {{
          setModalOpen: (isOpen: boolean) =>
            setModalConfig(
              produce((draft) => {
                draft.isOpen = isOpen;
              })
            ),
        }}
      </ModalForm>
    </>
  );
}
