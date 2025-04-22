import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, message } from 'antd';
import { searchItems, tableColumns, formConfig } from './config.ts';
import { list, edit, listCount } from '@/apis/modules/ticket';
import MyPage from '@/components/BasicPage';
import ModalForm from '@/components/ModalForm';
import { produce } from 'immer';

//发票
export default function TickManagement() {
  const pageRef = useRef<null>();
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({
    title: '编辑',
    isOpen: false,
    confirmLoading: false,
  });
  const handleTicket = (record: any) => {
    setModalConfig(
      produce((draft) => {
        draft.isOpen = true;
        draft.title = '上传发票';
        //先清空
        formConfig.formModel = {};
        if (record?.id) {
          formConfig.formModel = {
            ...record,
          };
        }
      })
    );
  };

  const handleOk = async (values: any) => {
    const id = values?.id;
    setModalConfig(
      produce((draft) => {
        draft.confirmLoading = true;
      })
    );
    try {
      if (id) {
        await edit(id, {
          statu: 1,
          fileId: values.fileId,
        });
        message.success('开票成功');
      }
      pageRef.current?.load();
    } finally {
      setModalConfig(
        produce((draft) => {
          draft.isOpen = false;
          draft.confirmLoading = false;
        })
      );
    }
  };

  return (
    <>
      <MyPage
        ref={pageRef}
        pageApi={list}
        pageCountApi={listCount}
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
                {!record.fileId && (
                  <Button
                    onClick={() => handleTicket(record)}
                    size="small"
                    color="primary"
                    variant="link"
                  >
                    开票
                  </Button>
                )}
              </Flex>
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
