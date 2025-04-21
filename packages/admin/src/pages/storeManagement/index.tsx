/**
 * 门店管理
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Space } from 'antd';
import { searchItems, tableColumns, formConfig } from './config';
import { list, add, edit, listCount } from '@/apis/modules/store.ts';
import MyPage from '@/components/BasicPage';
import { produce } from 'immer';
import ModalForm from '@/components/ModalForm';

//发票
export default function TickManagement() {
  const pageRef = useRef<null>();

  const [modalConfig, setModalConfig] = useState({
    title: '编辑',
    isOpen: false,
    confirmLoading: false,
  });
  const navigate = useNavigate();

  const handleOk = async (values: any) => {
    console.log(values, '+++form的值');
    const id = values?.id;
    setModalConfig(
      produce((draft) => {
        draft.confirmLoading = true;
      })
    );

    // 处理一下价格变成分
    if (values?.price) {
      values.price = values.price * 100;
    }
    try {
      if (id) {
        await edit(id, {
          ...values,
          createdAt: undefined,
          updatedAt: undefined,
          key: undefined,
        });
        message.success('编辑成功');
      } else {
        const result = await add(values);
        console.log(result);
        message.success('添加成功');
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

  const handleAddOrEdit = (record?: any) => {
    setModalConfig(
      produce((draft) => {
        draft.isOpen = true;
        draft.title = record?.id ? '编辑' : '新增';
        //先清空
        formConfig.formModel = {};
        if (record?.id) {
          formConfig.formModel = record;
        }
      })
    );
  };

  return (
    <>
      <MyPage
        pageApi={list}
        pageCountApi={listCount}
        tableOptions={tableColumns}
        ref={pageRef}
        searchItems={searchItems}
      >
        {{
          tableHeader: [
            {
              label: '新增',
              type: 'primary',
              onClick: handleAddOrEdit,
            },
          ],
          showColumnActions: (_, record) => {
            const id = record.id;
            const detailRoute = `/storeManagement/detail/${id}`;
            return (
              <Space>
                <Typography.Link onClick={() => navigate(detailRoute)}>
                  详情
                </Typography.Link>
                <Typography.Link onClick={() => handleAddOrEdit(record)}>
                  编辑
                </Typography.Link>
              </Space>
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
