import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, message } from 'antd';
import ModalForm from '@/components/ModalForm';
import { searchItems, tableColums, formConfig } from './config.tsx';
import { list, edit } from '@/apis/modules/advise';
import MyPage from '@/components/BasicPage';
import { produce } from 'immer';

export default function Index() {
  const pageRef = useRef<null>();
  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({
    title: '回复',
    isOpen: false,
    confirmLoading: false,
  });
  const handleReplay = (record: any) => {
    setModalConfig(
      produce((draft) => {
        draft.isOpen = true;
        //先清空
        formConfig.formModel = {};
        if (record?.id) {
          formConfig.formModel = record;
        }
      })
    );
  };

  const handleOk = async (values: any) => {
    const id = values?.id;
    if (!id) return;
    setModalConfig(
      produce((draft) => {
        draft.confirmLoading = true;
      })
    );

    try {
      await edit(id, values);
      message.success('回复成功');
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
        tableOptions={tableColums}
        searchItems={searchItems}
      >
        {{
          showColumnActions: (_, record) => {
            const id = record.id;
            const detailRoute = `/adviceManagement/detail/${id}`;
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
                {
                  !record?.replayContent &&
                  <Button
                    onClick={() => handleReplay(record)}
                    size="small"
                    color="primary"
                    variant="link"
                  >
                    回复
                  </Button>}
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
