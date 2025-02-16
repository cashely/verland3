import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import loadable from "@loadable/component";
const EditTemplate = loadable(() => import("../../components/AddForm"))

export default () => {
    const [formList, setFormList] = useState([])
    const params = useParams()

    useEffect(() => {
        console.log(params)

        setFormList([
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
                    rules: [{ required: true, message: 'Please select your country!' }],
                    allowClear: false
                }
            }
        ])
    }, [])
    return (
        <EditTemplate formList={formList} defaultFormData={params?.id ? {
            name: '大明哥'
        } : {}}></EditTemplate>
    )
}