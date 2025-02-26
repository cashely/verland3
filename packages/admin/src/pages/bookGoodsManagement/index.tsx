import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Modal, Flex, message } from "antd";
import { searchItems, tableColums, formConfig } from './config.tsx'
import { list, del } from '@/apis/modules/bookGood'
import MyPage from '@/components/BasicPage'
import ModalForm from '@/components/ModalForm'
import { edit, add } from '@/apis/modules/bookGood'
import { produce } from "immer";

export default function appointManagement() {

  const handleDel = (id: string) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除吗？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        console.log('OK');
        del(id).then(res => {
          console.log(res, '+++')
          message.success('删除成功')
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  const pageRef = useRef<null>()
  const [modalConfig, setModalConfig] = useState({
    title: '编辑',
    isOpen: false,
    confirmLoading: false
  })
  const navigate = useNavigate()

  const handleAddOrEdit = (record?: any) => {
    setModalConfig(produce(draft => {
      draft.isOpen = true
      draft.title = record?.id ? '编辑' : '新增'
      //先清空
      formConfig.formModel = {}
      if (record?.id) {
        formConfig.formModel = record
      }
    }))
  }

  const handleOk = async (values: any) => {
    console.log(values, '+++form的值')
    const id = formConfig.formModel?.id
    try {
      if (id) {
        setModalConfig(produce(draft => {
          draft.confirmLoading = true
        }))
        //等待2秒
        // await new Promise((resolve) => {
        //   setTimeout(resolve, 2000);
        // })
        edit({
          ...values,
          id
        }).then(() => {
          message.success('编辑成功')
          setModalConfig(produce(draft => {
            draft.isOpen = false
            draft.confirmLoading = false
          }))
        })
      } else {
        add({
          ...values,
        }).then(() => {
          message.success('添加成功')
        })
      }
    } finally {      
      setModalConfig(produce(draft => {
        draft.isOpen = false
        draft.confirmLoading = false
        pageRef.current?.load()
      }))
    }
  }

  return (
    <>
      <MyPage
        pageApi={list}
        tableOptions={tableColums}
        ref={pageRef}
        searchItems={searchItems}>
        {
          {
            tableHeader: [{
              label: '新增',
              type: 'primary',
              onClick: handleAddOrEdit
            }],
            showColumnActions: (_, record) => {
              const id = record.id
              const detailRoute = `/bookGoodsManagement/detail/${id}`
              return <Flex gap="small">
                {/* <NavLink to={route}>详情</NavLink> */}
                <Button onClick={() => navigate(detailRoute)} size="small" color="primary" variant="link">详情</Button>
                <Button onClick={() => handleAddOrEdit(record)} size="small" color="primary" variant="link">编辑</Button>
                {/* <Typography.Link>详情</Typography.Link>
                    <Typography.Link>删除</Typography.Link> */}
                <Button onClick={() => handleDel(record.id)} size="small" color="danger" variant="link">删除</Button>
                {/* <NavLink to={route}>详情</NavLink>
                    <a onClick={handleDel}>删除</a> */}
                {/* <Typography.Link>删除</Typography.Link> */}
                {/* <Link to="/" component={Typography.Link} /> */}
              </Flex>
            }
          }
        }
      </MyPage>
      <ModalForm {...modalConfig} formConfig={formConfig} onOk={handleOk}>
        {
          {
            setModalOpen: (isOpen: boolean) => setModalConfig(produce((draft) => {
              draft.isOpen = isOpen
            }))
          }
        }
      </ModalForm>
    </>
  );
}
