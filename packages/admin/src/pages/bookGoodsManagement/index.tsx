import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Flex, message } from 'antd';
import { searchItems, tableColums, formConfig } from './config.tsx';
import { list, del, edit, add } from '@/apis/modules/bookGood';
import MyPage from '@/components/BasicPage';
import ModalForm from '@/components/ModalForm';
import { FILE_URL } from '@/apis/request.ts';
import { produce } from 'immer';

export default function appointManagement() {
  const handleDel = (id: string) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除吗？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        del(id).then((res) => {
          message.success('删除成功');
          pageRef.current?.load();
        });
      },
    });
  };
  const pageRef = useRef<null>();
  const [modalConfig, setModalConfig] = useState({
    title: '编辑',
    isOpen: false,
    confirmLoading: false,
  });
  const navigate = useNavigate();

  const handleAddOrEdit = (record?: any) => {
    setModalConfig(
      produce((draft) => {
        draft.isOpen = true;
        draft.title = record?.id ? '编辑' : '新增';
        //先清空
        formConfig.formModel = {};
        if (record?.id) {
          formConfig.formModel = {
            ...record,
            thumb: record?.thumb?.path ? FILE_URL + record?.thumb?.path : '',
          };
        }
      })
    );
  };

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
        await edit(id, values);
        message.success('编辑成功');
      } else {
        await add(values);
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

  return (
    <>
      <MyPage
        pageApi={list}
        tableOptions={tableColums}
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
            const detailRoute = `/bookGoodsManagement/detail/${id}`;
            return (
              <Flex gap="small">
                {/* <NavLink to={route}>详情</NavLink> */}
                <Button
                  onClick={() => navigate(detailRoute)}
                  size="small"
                  color="primary"
                  variant="link"
                >
                  详情
                </Button>
                <Button
                  onClick={() => handleAddOrEdit(record)}
                  size="small"
                  color="primary"
                  variant="link"
                >
                  编辑
                </Button>
                {/* <Typography.Link>详情</Typography.Link>
                    <Typography.Link>删除</Typography.Link> */}
                <Button
                  onClick={() => handleDel(record.id)}
                  size="small"
                  color="danger"
                  variant="link"
                >
                  删除
                </Button>
                {/* <NavLink to={route}>详情</NavLink>
                    <a onClick={handleDel}>删除</a> */}
                {/* <Typography.Link>删除</Typography.Link> */}
                {/* <Link to="/" component={Typography.Link} /> */}
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
