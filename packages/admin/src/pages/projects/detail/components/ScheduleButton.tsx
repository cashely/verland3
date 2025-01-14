import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Popover, Select } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import request from '../../../../utils/request';

interface IProps {
    onSave: (scheduleId?: number) => void;
    scheduleId?: number;
    disabled?: boolean;
}

const RULES = {
    path: [
        { required: true }
    ],
    times: [
        { required: true, max: 20, min: 1 }
    ],
    gap: [
        { required: true, min: 1000 }
    ]
}

const ScheduleButton = (props: IProps) => {

    const [times, setTimes] = useState(1);
    const [path, setPath] = useState('');
    const [method, setMethod] = useState(2);
    const [gap, setGap] = useState(1000);
    const [canDelete, setCanDelete] = useState(false);
    const [form] = Form.useForm();


    const onSave = async () => {
        const res: any = await request.post('/schedule', {
            times,
            path,
            method,
            gap
        })
        if (res.code === 200) {
            setCanDelete(true);
            props.onSave(res.data.id);
        }
    }

    const onDelete = async () => {
        const res: any = await request.delete(`/schedule/${props.scheduleId}`)
        if (res.code === 200) {
            setCanDelete(false);
            setTimes(1);
            setPath('');
            setMethod(2);
            setGap(1000);
            props.onSave();
        }
    }

    const getSchedule = async () => {
        if (!props.scheduleId) {
            return;
        }
        const res: any = await request.get(`/schedule/${props.scheduleId}`,)
        if (res.code === 200) {
            setTimes(res.data.times);
            setPath(res.data.path);
            setMethod(res.data.method);
            setGap(res.data.gap);
            setCanDelete(true)
        }
    }

    useEffect(() => {
        getSchedule();
    }, []);

    return (
        <Popover
            trigger="click"
            content={
                <div>
                    <Form layout="inline" form={form}>
                        <Form.Item label="调用路径" rules={RULES.path}>
                            <Input placeholder='请输入定时时间' value={path} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPath(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="调用方法">
                            <Select value={method} onChange={(v) => setMethod(v)}>
                                <Select.Option value={1}>GET</Select.Option>
                                <Select.Option value={2}>POST</Select.Option>
                                <Select.Option value={3}>PUT</Select.Option>
                                <Select.Option value={4}>DELETE</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="调用频次">
                            <InputNumber className='w-[100px]' controls={false} placeholder='请输入1-20' value={times} onChange={(e) => setTimes(e as number)} addonAfter={<div>次</div>} />
                        </Form.Item>
                        <Form.Item label="调用间隔">
                            <InputNumber className='w-[100px]' controls={false} placeholder='请输入定时时间' value={gap} onChange={(e) => setGap(e as number)} addonAfter={<div>ms</div>} />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' onClick={onSave}>
                                保存
                            </Button>
                            {
                                canDelete &&
                                <Button className="ml-1" type='primary' color='danger' onClick={onDelete}>
                                    删除
                                </Button>
                            }
                        </Form.Item>
                    </Form>
                </div>
            }
        >
            <Button type='primary' disabled={props.disabled} icon={<ClockCircleOutlined />}>
                定时器
            </Button>
        </Popover>
    )
}

export default ScheduleButton;