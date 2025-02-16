import AddForm from '@/components/AddForm';
import { add, edit } from '@/apis/modules/bookGood'

const formConfig = {
    formList: [
        {
            label: '产品名称',
            prop: 'title',
            type: 'input',
            options: [],
            rules: [{ required: true, message: '请输入产品名称' }],
            itemProps: {
                placeholder: '请输入服务名称',
                // disabled: true
                // readOnly: true,
            }
        },
        {
            label: '价格',
            prop: 'price',
            type: 'inputNumber',
            rules: [{ required: true, message: '请输入价格' }],
            itemProps: {
                placeholder: '请输入价格',
                prefix: '￥',
                suffix: "RMB",
                controls: false,
                precision: "2",
            }
        },
        {
            label: "缩略图",
            prop: 'thumb',
            type: 'upload',
            span: 24,
        },
        {
            label: '产品内容',
            prop: 'content',
            type: 'textarea',
            span: 24,
            itemProps: {
                placeholder: '请输入服务内容',
                // readonly: true,
                // required: true,
            }
        }
    ],
    formModel: {
        title: '',
        content: '',
        price: ''
    },
    rules: []
}

//提交
const onSubmit = (formModel) => {
    console.log('提交', formModel)
    add(formModel).then(res => {
        console.log(res)
    })
}
// 重置
const onReset = (val) => {
    console.log('重置', val)
}


export default () => <AddForm {...formConfig} onSubmit={onSubmit} onReset={onReset}>
    <div>1</div>
</AddForm>