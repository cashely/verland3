import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Modal, message, Table } from 'antd';
import { getDocumentRequestsApi } from '../api';

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
        const res: any = await getDocumentRequestsApi(props.selectedDocument.id);
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
                title="访问记录"
                open={visible}
                onCancel={() => setVisible(false)}
                width={1000}
                height={600}
                className="overflow-hidden"
                footer={null}
                loading={loading}
            >
                {/* {JSON.stringify(logs)} */}
                <Table
                    scroll={{ x: 'auto', y: 500 }}
                    bordered
                    pagination={false}
                    size="small"
                    rowKey='id'
                    dataSource={logs}
                    columns={[
                        {
                            title: '访问IP',
                            dataIndex: 'from',
                            key: 'from',
                        },
                        {
                            title: '访问时间',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (text) => <span className="text-nowrap">{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
                        },
                        {
                            title: 'HEADER信息',
                            dataIndex: 'headers',
                            key: 'headers',
                            render: (text) => <code>{text}</code>,
                        }
                    ]}
                />
            </Modal>
            {props.children(visible, setVisible)}
        </>
    )
}