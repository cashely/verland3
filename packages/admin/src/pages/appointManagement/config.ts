const searchConfig = [
    {
        label: '姓名',
        prop: 'name',
        type: 'input',
        placeholder: '请输入姓名'
    },
    {
        label: '手机号',
        prop: 'phone',
        type: 'input',
        placeholder: '请输入手机号',
        itemProps: {
            // disabled: true,
            allowClear: false
        }
    },
    {
        label: '年龄',
        prop: 'age',
        type: 'inputNumber',
        placeholder: '请输入年龄',
        itemProps: {
            // disabled: true,
            allowClear: false
        }
    },
    {
        label: '性别',
        prop: 'sex',
        type: 'select',
        placeholder: '请选择性别',
        options: [{
            label: '男',
            value: 1
        }, {
            label: '女',
            value: 2
        }]
    },
]




export {
    searchConfig
}