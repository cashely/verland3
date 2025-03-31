import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd'
import AddForm from '../AddForm';

interface IProps {
  isOpen: boolean;
  title: string,
  setModalOpen: (open: boolean) => void,
  modalConfig?: {
    width?: number,
    height?: number,
  },
  formConfig?: {
    formList: any[],
    formModal: {},
    rules: []
  },
  children?: React.ReactNode | any,
  onOk?: (formValues: any) => void,
  onCancel?: () => void,
}

const ModalForm = (props: IProps) => {
  const formRef = useRef<any>()
  const { formConfig, title = '编辑', isOpen = false, onOk, onCancel } = props
  const [isOpenState, setIsOpenState] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleOk = async () => {
    //获取表单数据
    const FormInstance = formRef?.current

    try {
      const values = await FormInstance.form?.validateFields();
      onOk?.(FormInstance?.formData || {})
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
    console.log(FormInstance.formData, 'FormInstance.formData')
    //调用子组件的submit方法
    // FormInstance.submit()
    //这也是获取表单值的一种方法
    // console.log(FormInstance.getFieldsValue(), '+++')
  }

  const handleCancel = () => {
    //清空表单
    formRef?.current?.reset()
    props.children?.setModalOpen(false)
  }

  useEffect(() => {
    setIsOpenState(isOpen)
  }, [isOpen])

  return (
    <Modal
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      loading={false}
      title={title}
      open={isOpenState}
      onOk={handleOk}
      onCancel={handleCancel}
      styles={
        {
          body: {
            borderTop: '1px solid #e9e9e9',
            paddingTop: 20
          }
        }
      }>
      <AddForm {...formConfig} ref={formRef} setFormLoading={setConfirmLoading}>
      </AddForm>
    </Modal>
  )

}

export default ModalForm