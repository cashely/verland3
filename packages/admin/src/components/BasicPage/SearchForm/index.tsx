import { Col, Form, Input, Row, Select, InputNumber, DatePicker } from 'antd';
import SearchTools from './FormTools';
import './index.scss';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
const { Option } = Select;
const formItemClasses = `rounded-[4px]`;
export default function SearchForm({ items = [], onSearch = () => {} }: any) {
  const initData = items.reduce((acc, cur) => {
    acc[cur.prop] = cur.initValue || '';
    return acc;
  }, {});
  const [searchForm] = Form.useForm();
  const [formData, setFormData] = useState(initData);
  //提交
  const onFinish = (values: any) => {
    console.log(values, formData, '43onFinish');
    // const values = searchForm.validateFields()
    onSearch && onSearch(formData);
  };

  //重置
  const handleResetForm = () => {
    searchForm.resetFields();
    setFormData(initData);
    onSearch && onSearch(initData);
  };

  const handleChange = (prop: string, value: any) => {
    console.log(prop, value, '43handleChange');
    if (prop === 'dateRange') {
      const [start, end] = value;
      setFormData((prev) => ({
        ...prev,
        start: dayjs(start).format('YYYY-MM-DD'),
        end: dayjs(end).format('YYYY-MM-DD'),
        [prop]: undefined,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [prop]: value ?? '' }));
  };

  return (
    <div className={'search-form-box bg-white rounded p-[16px] pt-[20px]'}>
      {' '}
      <Form form={searchForm} name="searchForm" onFinish={onFinish}>
        <Row gutter={24}>
          {items.map((field: any, index: number) => (
            <Col span={8} key={index}>
              <Form.Item label={field.label} name={field.prop}>
                {field.type === 'input' ? (
                  <Input
                    className={formItemClasses}
                    styles={{ prefix: 'red' }}
                    classNames={{ count: '1' }}
                    placeholder={field.placeholder}
                    allowClear
                    value={formData[field.prop]}
                    onChange={(e) => handleChange(field.prop, e.target.value)}
                    {...field.itemProps}
                  />
                ) : null}
                {field.type === 'inputNumber' ? (
                  <InputNumber
                    value={formData[field.prop]}
                    onChange={(e) => handleChange(field.prop, e.target.value)}
                    className={formItemClasses}
                    style={{
                      width: '100%',
                    }}
                    min={1}
                    placeholder={field.placeholder}
                    {...field.itemProps}
                  />
                ) : null}
                {field.type === 'select' ? (
                  <Select
                    value={formData[field.prop]}
                    onChange={(value) => handleChange(field.prop, value)}
                    allowClear={field.clearable ?? false}
                    className={formItemClasses}
                    placeholder={field.placeholder}
                  >
                    {field?.options?.map((option, indey) => (
                      <Option key={indey} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                ) : null}
                {field.type === 'month' ? (
                  <DatePicker.RangePicker
                    value={formData[field.prop]}
                    onChange={(value) => handleChange(field.prop, value)}
                    allowClear={field.clearable ?? false}
                    className={formItemClasses}
                  ></DatePicker.RangePicker>
                ) : null}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <SearchTools
          resetForm={handleResetForm}
          listNum={items.length}
        ></SearchTools>
      </Form>
    </div>
  );
}
