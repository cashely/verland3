import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  Checkbox,
  Radio,
} from 'antd';
import type { FormProps, FormInstance } from 'antd';
import UploadButton from '@/components/UploadButton';
import { FILE_URL } from '@/apis/request';
import { produce } from 'immer';
import { getuid } from 'process';
const { Option } = Select;
const formItemClasses = `rounded-[4px]`;

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
  };
}

export default forwardRef<CustomFormRef, CustomFormProps>(
  (
    {
      formModel = {},
      formList = [],
      onSubmit = () => {},
      onReset = () => {},
      setFormLoading = () => {},
    }: any,
    ref
  ) => {
    const [detailForm] = Form.useForm();
    // const formValues = Form.useWatch([], detailForm);
    const [formData, setFormData] = useState(formModel);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      form: detailForm,
      formData,
      submit: () => detailForm.submit(),
      reset: () => handleReset(),
    }));

    //重置
    const handleReset = () => {
      detailForm.resetFields();
      // setFormData(detailForm.getFieldsValue())
      onReset?.(detailForm.getFieldsValue());
    };

    //暂时用不到
    // const handleSubmit = (values?: any) => {
    //   console.log('提交表单43++++++', detailForm, values);
    //   setTimeout(() => {
    //     onSubmit?.({
    //       ...values,
    //       fileList: undefined,
    //     });
    //   }, 2000);
    // };

    //图片上传成功
    const handleUploadSuccess = (formItem: any, fileId: string) => {
      console.log(formItem, '上传成功43', fileId);
      setFormLoading(false);
      //设置图片路径到表单上
      if (formItem.uploadProps?.maxCount > 1) {
        detailForm.setFieldValue(formItem.prop, [fileId]);
        detailForm.setFieldValue(formItem.putProp, [fileId]);
      } else {
        detailForm.setFieldValue(formItem.prop, '111');
        detailForm.setFieldValue(formItem.putProp, fileId); //thumb
      }

      setFormData((d: any) => {
        return {
          ...d,
          [formItem.putProp]:
            formItem.uploadProps?.maxCount > 1 ? [fileId] : fileId,
        };
      });
    };

    //表单值变化
    const handleValueChange = (_: any, values: Record<string, any>) => {
      console.log('#111143', _, values);
      setFormData({
        ...formData,
        ...values,
        id: formModel?.id,
      });
    };

    // _fileList={formatFileList(formData, item.prop)}
    const formatFileList = (item: any) => {
      console.log('43+++formData+++', formData, formData[item.prop], '+++43');
      const fileList = [] as any;
      if (formData[item.prop] && Array.isArray(formData[item.prop])) {
        formData[item.prop].map((n: any) => {
          fileList.push({
            url: FILE_URL + '/' + n?.image?.path,
            name: formData.title || '缩略图',
            uid: n.image.id,
          });
        });
      } else {
        fileList.push({
          url: FILE_URL + '/' + formData[item.prop],
          name: formData.title || '缩略图',
          uid: formData?.id,
        });
      }

      return fileList;
    };

    const handleDeleteFile = (putProp: string, fileId: string) => {
      console.log('删除文件43', fileId, formData);
      setFormData((d: any) => {
        return {
          ...d,
          [putProp]: undefined,
          thumb: undefined,
        };
      });
    };

    //只能用setFieldsValue在初始化的时候设置默认值
    useEffect(() => {
      console.log(formModel, 'formModel变更441');
      detailForm.setFieldsValue(formModel);
      // formatFileList(formModel);
    }, [formModel]);

    return (
      <Form
        layout="vertical"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        initialValues={formData}
        form={detailForm}
        name="detailForm"
        colon={true}
        // onFinish={handleSubmit}
        labelAlign="left"
        onValuesChange={handleValueChange}
      >
        {/* formModal--  {JSON.stringify(formModel)}
      <hr></hr>
      formData-- {JSON.stringify(formData)} */}
        <Row gutter={24}>
          {formList.map((item: any, index: number) => (
            <Col span={24} key={index}>
              <Form.Item
                name={item.prop}
                label={item.label}
                layout={
                  ['radio', 'checkbox'].includes(item.type)
                    ? 'horizontal'
                    : 'vertical'
                }
                labelCol={{ span: item.labelCol || 24 }}
                wrapperCol={{ span: item.wrapperCol || 24 }}
                rules={item.rules ?? []}
                required={item.rules?.length}
              >
                {item.type === 'input' ? (
                  <Input
                    className={formItemClasses}
                    styles={{ prefix: 'red' }}
                    classNames={{ count: '1' }}
                    placeholder={item.placeholder}
                    allowClear
                    {...item.itemProps}
                  />
                ) : null}
                {item.type === 'inputNumber' ? (
                  <InputNumber
                    className={formItemClasses}
                    style={{
                      width: '100%',
                    }}
                    min={0.01}
                    placeholder={item.placeholder}
                    {...item.itemProps}
                  />
                ) : null}
                {item.type === 'radio' ? (
                  <Radio.Group options={item.options || []} />
                ) : null}
                {item.type === 'checkbox' ? (
                  <>
                    <Checkbox.Group options={item.options || []} />
                  </>
                ) : null}
                {item.type === 'select' ? (
                  <Select
                    className={formItemClasses}
                    placeholder={item.placeholder}
                  >
                    {item.options.map((option: any, indey: number) => (
                      <Option key={indey} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                ) : null}
                {item.type === 'upload' ? (
                  <>
                    {/* {JSON.stringify(formData[item.prop])} */}
                    {/* {JSON.stringify(item.uploadProps)} */}
                    <UploadButton
                      name={item.prop}
                      putProp={item.putProp}
                      onUploadSuccess={(fileId) =>
                        handleUploadSuccess(item, fileId)
                      }
                      onDeleteFile={handleDeleteFile}
                      setFormLoading={setFormLoading}
                      uploadProps={item.uploadProps}
                      receiveFileList={() => formatFileList(item)}
                    >
                      {/* {
                   (isUploading: boolean) => {
                     setBtnLoading(isUploading)
                   }
                 } */}
                    </UploadButton>
                  </>
                ) : null}
                {item.type === 'textarea' ? (
                  <Input.TextArea
                    className={formItemClasses}
                    placeholder={item.placeholder}
                    rows={4}
                    showCount={true}
                    maxLength={item.itemProps.maxLength ?? 100}
                    {...item.itemProps}
                  />
                ) : null}
              </Form.Item>
            </Col>
          ))}
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
    );
  }
);
