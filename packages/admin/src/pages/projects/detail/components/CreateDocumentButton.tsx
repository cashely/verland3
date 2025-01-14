import React, { useState, useMemo } from'react';
import { Button, Modal, Form, Input, message } from 'antd';
import cloneDeep from 'lodash-es/cloneDeep';
import { createDocumentApi } from '../api';
import type { RequestResult } from '../../../..';

type TProps = {
    onOk?: () => void;
    children?: (visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode; 
}

const DEFAULTFORMDATA = {
    name: 'aaa',
    folder: 'vvv',
    path: 'a/b',
    projectId: 1,
    content: JSON.stringify({name: 'String'})
}

const CreateDocumentButton: React.FC<TProps> = (props: TProps) => {
    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData] = useState(cloneDeep(DEFAULTFORMDATA));

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
            const result: RequestResult<any> = await createDocumentApi(values);
            if (result.code === 200) {
                message.success('创建成功');
                setLoading(false);
                setVisible(false);
                props.onOk && props.onOk();
            } else {
                message.error('创建失败');
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



    return (
        <div>
            {
                props.children
                ? props.children(visible, setVisible)
                : (
                    <Button
                        type="primary"
                        onClick={() => setVisible(true)}
                    >
                        创建文档
                    </Button>
                )
            }
            <Modal
                title="创建文档"
                open={visible}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
                loading={loading}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    form={form}
                    initialValues={formData}
                >
                    <Form.Item
                        label="文档名称"
                        name="name"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="所属项目"
                        name="projectId"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="文件夹名称"
                        name="name"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="文档名称"
                        name="folder"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="文档路径"
                        name="path"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="文档内容"
                        name="content"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default CreateDocumentButton;