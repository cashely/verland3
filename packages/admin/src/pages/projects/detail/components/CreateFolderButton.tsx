import React, { useState, useMemo } from'react';
import { Button, Modal, Form, Input, message } from 'antd';
import cloneDeep from 'lodash-es/cloneDeep';
import { createFolderApi } from '../api';
import type { RequestResult } from '../../../..';

type TProps = {
    onOk?: () => void;
    projectId?: number | string;
    children?: (visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode;
}

const DEFAULTFORMDATA = {
    name: '',
}

const CreateFolderButton: React.FC<TProps> = (props: TProps) => {
    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData] = useState(cloneDeep(DEFAULTFORMDATA));

    const [form] = Form.useForm();

    const formRules = useMemo(() => {
        return {
            name: [
                {
                    required: true,
                    message: '文件夹名称不能为空!'
                }
            ]
        }
    }, []);

    const onHandleOk = () => {
        form.validateFields().then(async (values) => {
            setLoading(true);
            const result: RequestResult<any> = await createFolderApi({
               ...values,
                projectId: props.projectId
            });
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
                props.children ? props.children(visible, setVisible) :
                    <Button
                        type="primary"
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        创建文件夹
                    </Button>
            }
            <Modal
                title="创建文件夹"
                open={visible}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
                loading={loading}
                width={300}
            >
                <Form
                    className='pt-4 w-full'
                    layout="horizontal"
                    form={form}
                    initialValues={formData}
                >
                    <Form.Item
                        name="name"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Form.Item
                        label="所属项目"
                        name="projectId"
                        rules={formRules.name}
                    >
                        <Input />
                    </Form.Item> */}
                </Form>
            </Modal>
        </div>
    );
}

export default CreateFolderButton;