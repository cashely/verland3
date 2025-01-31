import { useState } from "react";
import { Button, Col, Form, Input, Row, Select, Space, InputNumber } from 'antd';

const { Option } = Select
const formItemClasses = `rounded-[4px]`
export default function DetailTemplate(props: any) {
    const {
        formList = [],
        onSubmit = () => { },
        templateConfig = {
            showTools: true,
        }
    } = props

    const [formModel, setFormModel] = useState({})
    const [detailForm] = Form.useForm();

    //提交
    const onFinish = (values: any) => {
        setFormModel(values)
        console.log(detailForm, values)
        onSubmit && onSubmit(formModel)
    }


    return (
        <section className={'bg-white rounded p-[16px] pt-[20px]'}>
            <Form form={detailForm} name="detailForm" onFinish={onFinish}>
                <Row gutter={24}>
                    {
                        formList.map((item, index) => (<Col span={6} key={index}>
                            <Form.Item
                                name={item.prop}
                                label={item.label}
                            >
                                {item.type === 'input' ? <Input className={formItemClasses} styles={{ prefix: 'red' }} classNames={{ count: '1' }} placeholder={item.placeholder} allowClear {...item.itemProps} /> : null}
                                {item.type === 'inputNumber' ? <InputNumber className={formItemClasses} style={{
                                    width: '100%'
                                }} min={1} placeholder={item.placeholder}  {...item.itemProps} /> : null}
                                {item.type === 'select' ? <Select className={formItemClasses} placeholder={item.placeholder}>
                                    {item.options.map((option, indey) => (<Option key={indey} value={option.value}>{option.label}</Option>))}
                                </Select> : null}
                            </Form.Item>

                        </Col>)
                        )
                    }
                </Row>
                {
                    templateConfig.showTools ?

                        <div style={{ textAlign: 'right' }}>
                            <Space size="small">
                                {/* <Button
					shape="round"
					onClick={handleResetForm}
				>
					重置
				</Button> */}
                                <Button type="primary" htmlType="submit">
                                    确认
                                </Button>
                            </Space>

                        </div>
                        : null
                }
            </Form></section>
    );
}
