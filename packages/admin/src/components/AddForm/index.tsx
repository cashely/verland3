import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Col, Form, Input, Row, Select, Space, InputNumber } from 'antd';
import type { FormProps, FormInstance } from 'antd'
import UploadButton from "@/components/UploadButton";
import { produce } from "immer";
const { Option } = Select
const formItemClasses = `rounded-[4px]`

// 表单项配置类型
export interface FormItemConfig {
  name: string;
  label?: string;
  rules?: any[];
  component: React.ReactNode;
  initialValue?: any;
}

// 通过 ref 暴露的方法
export interface CustomFormRef {
  form: FormInstance;
  submit: () => void;
  reset: () => void;
}
// 组件 Props
interface CustomFormProps extends Omit<FormProps, 'onFinish'> {
  formList: FormItemConfig[];
  onSubmit?: (values: any) => void;
  onReset?: () => void;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  formModel?: {
    id?: string;
    [key: string]: any;
  }
}


export default forwardRef<CustomFormRef, CustomFormProps>(({
  formModel = {},
  formList = [],
  onSubmit = () => { },
  onReset = () => { },
  submitText = '提交',
  resetText = '重置',
  rules = []
}: any, ref) => {
  const [detailForm] = Form.useForm();
  // const formValues = Form.useWatch([], detailForm);
  const [formData, setFormData] = useState({})

  // useEffect(() => {
  //   setFormData({ ...formModel, ...formValues })
  // }, [detailForm, formValues])


  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    form: detailForm,
    submit: () => handleSubmit(),
    reset: () => handleReset(),
  }));

  //重置
  const handleReset = () => {
    detailForm.resetFields()
    // setFormData(detailForm.getFieldsValue())
    onReset?.(detailForm.getFieldsValue())
  }
  const handleSubmit = (values?: any) => {
    console.log(detailForm, values)
    setTimeout(() => {
      onSubmit?.(values)
    }, 2000)
  }

  //图片上传成功
  const handleUploadSuccess = ({ prop, data }: any) => {
    console.log('上传成功', prop, data)
    setFormData(produce(formData, (draft: any) => {
      draft[prop] = data
      console.log(draft)
    }))
  }

  //只能用setFieldsValue在初始化的时候设置默认值
  useEffect(() => {
    console.log(formModel, 'formModel变更')
    detailForm.setFieldsValue(formModel)
  }, [formModel, detailForm])


  return (
    <Form layout="vertical" labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }} initialValues={formModel} form={detailForm} name="detailForm" onFinish={handleSubmit} labelAlign="left">
      <Row gutter={24}>
        {
          formList.map((item, index) =>
          (
            <Col span={item.span ?? 8} key={index}>
              <Form.Item
                name={item.prop}
                label={item.label}
                labelCol={{ span: item.span }}
                wrapperCol={{ span: item.span }}
                rules={item.rules ?? []}
                required={item.rules?.length}
              >
                {item.type === 'input' ? <Input className={formItemClasses} styles={{ prefix: 'red' }} classNames={{ count: '1' }} placeholder={item.placeholder} allowClear {...item.itemProps} /> : null}
                {item.type === 'inputNumber' ? <InputNumber className={formItemClasses} style={{
                  width: '100%'
                }} min={1} placeholder={item.placeholder}  {...item.itemProps} /> : null}
                {item.type === 'select' ? <Select className={formItemClasses} placeholder={item.placeholder}>
                  {item.options.map((option, indey) => (<Option key={indey} value={option.value}>{option.label}</Option>))}
                </Select> : null}
                {
                  item.type === 'upload' ?
                    <UploadButton name={item.prop} onUploadSuccess={handleUploadSuccess}>
                      {/* {
                      (isUploading: boolean) => {
                        setBtnLoading(isUploading)
                      }
                    } */}
                    </UploadButton>
                    : null
                }
                {
                  item.type === 'textarea' ? <Input.TextArea className={formItemClasses} placeholder={item.placeholder} rows={4} showCount={true} maxLength={item.itemProps.maxLength ?? 100} {...item.itemProps} /> : null
                }
              </Form.Item>
            </Col>
          ))
        }
      </Row>
      {/* {
        formList?.length ? <div style={{ textAlign: 'right' }}>
          <Space size="small">
            <Button
              type="default"
              htmlType="reset"
              onClick={handleReset}
            >
              {resetText}
            </Button>
            <Button type="primary" htmlType="submit" loading={btnLoading}>
              {submitText}
            </Button>
          </Space>

        </div> : null
      } */}
    </Form>
  )
})
