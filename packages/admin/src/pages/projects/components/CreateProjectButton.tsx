import React, { useState, useMemo, useEffect } from'react';
import { Modal, Form, Input, message, Radio, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useProject from './hooks/useProject';
import { createProjectApi, updateProjectApi } from '../api';
import type { RequestResult } from '../../..';

type TProps = {
    title?: string;
    id?: string | number;
    onOk?: () => void;
    children?: (setVisible: Function) => React.ReactNode;
}

const CreateProjectButton: React.FC<TProps> = (props: TProps) => {

    const { title = '创建项目', id } = props;

    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const { project, loading: detailLoading } = useProject(id, visible);

    const [formData, setFormData] = useState({});

    const [form] = Form.useForm();

    const formRules = useMemo(() => {
        return {
            name: [
                {
                    required: true,
                    message: 'Please input your project name!'
                }
            ]
        }
    }, []);

    const onHandleOk = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);
            let result: RequestResult<any>;

            if (id) {
                result = await updateProjectApi(id, values);
            } else {
                result = await createProjectApi(values);
            }
            if (result.code === 200) {
                message.success('操作成功');
                setLoading(false);
                setVisible(false);
                props.onOk && props.onOk();
            } else {
                setLoading(false);
            }
        }).catch((errorInfo) => {
            console.error('errorInfo', errorInfo);
        })
        // setVisible(false);
    };

    const onHandleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    useEffect(() => {
        setFormData(project);
        form.setFieldsValue(project);
    }, [project]);



    return (
        <div>
            <>
                {
                    props.children
                    ?
                    props.children(setVisible)
                    :
                    <Button type='primary' onClick={() => setVisible(true)} icon={<PlusOutlined />}>创建项目</Button>
                }
            </>
            <Modal
                title={title}
                open={visible}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
                loading={loading || detailLoading}
            >
                <Form
                    className='w-full pt-4'
                    labelCol={{ span: 4 }}
                    layout="horizontal"
                    form={form}
                    initialValues={formData}
                >
                    <Form.Item
                        label="项目名称"
                        name="name"
                        rules={formRules.name}
                    >
                        <Input width="100%" />
                    </Form.Item>
                    <Form.Item
                        label="webhook"
                        name="webhook"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="项目权限"
                        name="open"
                    >
                        <Radio.Group>
                            <Radio value={0}>私有</Radio>
                            <Radio value={1}>公开</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateProjectButton;