import { useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space, InputNumber } from 'antd';

const { Option } = Select
const formItemClasses = `rounded-[4px]`
export default function SearchForm(props: any) {
	const {
		formList = [],
		onSubmit = () => { },
	} = props

	console.log(formList, '--qq')
	const [formModel, setFormModel] = useState({})
	const [expand, setExpand] = useState(false)
	const [searchForm] = Form.useForm();

	//提交
	const onFinish = (values: any) => {
		setFormModel(values)
		console.log(searchForm, values)
		onSubmit && onSubmit(formModel)
	}

	//重置
	const handleResetForm = () => {
		searchForm.resetFields();
		setFormModel({})
	}

	const SearchTools = () => {
		return <div style={{ textAlign: 'right' }}>
			<Space size="small">
				<Button
					shape="round"
					onClick={handleResetForm}
				>
					重置
				</Button>
				<Button type="primary" htmlType="submit" shape="round">
					搜索
				</Button>
				{
					formList.length > 6 ? <a
						style={{ fontSize: 12 }}
						onClick={() => {
							setExpand(!expand);
						}}
					>
						<DownOutlined rotate={expand ? 180 : 0} /> {expand ? "收起" : '展开'}
					</a> : null
				}
			</Space>

		</div>
	}

	return (
		<section className={'bg-white rounded p-[16px] pt-[20px]'}>	<Form form={searchForm} name="searchForm" onFinish={onFinish}>
			<Row gutter={24}>
				{
					formList.map((item, index) => (<Col span={8} key={index}>
						<Form.Item
							name={item.prop}
							label={item.label}
						>
							{item.type === 'input' ? <Input className={formItemClasses} styles={{ prefix: 'red' }} classNames={{ count: '1' }} placeholder={item.placeholder} allowClear {...item.itemProps} /> : null}
							{item.type === 'inputNumber' ? <InputNumber className={formItemClasses} style={{
								width: '100%'
							}} min={1} placeholder={item.placeholder}  {...item.itemProps} /> : null}
							{item.type === 'select' ? <Select className={formItemClasses} placeholder={item.placeholder}>
								{item?.options?.map((option, indey) => (<Option key={indey} value={option.value}>{option.label}</Option>))}
							</Select> : null}
						</Form.Item>

					</Col>)
					)
				}
			</Row>
			<SearchTools></SearchTools>
		</Form></section>
	);
}
