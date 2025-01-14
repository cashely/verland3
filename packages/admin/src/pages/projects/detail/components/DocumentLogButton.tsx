import React, { useState, useEffect } from "react";
import { Modal, message, Table } from 'antd';
import dayjs from "dayjs";
import { getDocumentLogsApi } from '../api';

interface IProps {
    selectedDocument: any;
    children: (visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode;
}

export default function DocumentLogButton(props: IProps) {

    const [visible, setVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState<any>([]);

    /**
     * @name 获取文档日志
     */
    const getDocumentLogs = async () => {
        setLoading(true);
        const res: any = await getDocumentLogsApi(props.selectedDocument.id);
        setLoading(false);
        if (res.code === 200) {
            setLogs(res.data);
        } else if (res.code === 500) {
            message.error(res.msg);
        }
    }

    useEffect(() => {
        if (visible) {
            getDocumentLogs();
        } else {
            setLogs([]);
        }

    }, [visible])

    return (
        <>
            <Modal
                title="文档日志"
                open={visible}
                onCancel={() => setVisible(false)}
                width={1000}
                height={600}
                footer={null}
                loading={loading}
            >
                <Table
                    dataSource={logs}
                    bordered
                    pagination={false}
                    size="small"
                    rowKey='id'
                    columns={[
                        {
                            title: '操作人',
                            render: (item: any) => item?.operator?.username
                        },
                        {
                            title: '操作类型',
                            render: (item: any) => {
                                switch (item.type) {
                                    case 1:
                                        return '创建';
                                    case 0:
                                        return '修改';
                                    case 2:
                                        return '删除';
                                    default:
                                        return '未知';
                                }
                            }
                        },
                        {
                            title: '操作内容',
                            render: (item: any) => <code>{item?.content}</code>
                        },
                        {
                            title: '操作时间',
                            render: (item: any) => dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                        }
                    ]}
                />
            </Modal>
            {props.children(visible, setVisible)}
        </>
    )
}