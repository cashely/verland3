import { Col, Form, Input, Row, Select, InputNumber } from 'antd';
import SearchTools from "./FormTools";
import './index.scss'
const { Option } = Select
const formItemClasses = `rounded-[4px]`
export default function SearchForm({
	items = [],
	onSearch = () => { },
}: any) {

	const [searchForm] = Form.useForm();
	//提交
	const onFinish = (values: any) => {
		// const values = searchForm.validateFields()
		console.log(searchForm, values)
		onSearch && onSearch(values)
	}

	//重置
	const handleResetForm = () => {
		searchForm.resetFields();
	}
	return (
		<div className={'search-form-box bg-white rounded p-[16px] pt-[20px]'}>	<Form form={searchForm} name="searchForm" onFinish={onFinish}>
			<Row gutter={24}>
				{
					items.map((item, index) => (<Col span={8} key={index}>
						<Form.Item
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
			<SearchTools resetForm={handleResetForm} listNum={items.length}></SearchTools>
		</Form></div>
	);
}
