import { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import df from 'd-forest';
import { getDocumentsApi, getFoldersApi, createDocumentApi, deleteDocumentApi, updateDocumentApi, getDocumentApi } from './api';
import TreeSilder from "./components/TreeSilder";
import EmptyEditor from "./components/EmptyEditor";
import { Button, Input, message, Modal, Space, Checkbox, notification, Splitter, Select, ConfigProvider } from "antd";
import { AiOutlineSave } from 'react-icons/ai';
import { isEmpty, remove } from 'lodash-es';
import { z } from 'zod';
import Editor from "../../../components/editor";
import DocumentLogButton from "./components/DocumentLogButton";
import DocumentRequestButton from "./components/DocumentRequestButton";
import ExportDocument from "./components/ExportDocument";
import CodeRender from "../../../components/codeRender";
import ScheduleButton from "./components/ScheduleButton";
import { TTreeNode } from "../../..";
import { editArray } from "../../../utils";
import useStore from "../../../store";
import isEqual from 'fast-deep-equal';
import { getCurrentUserApi } from "../../../components/layout/apis";

function ProjectDetail() {
    const { projectId } = useParams<any>();

    const [documents, setDocuments] = useState<any[]>([]);

    const [folders, setFolders] = useState<any[]>([]);

    const [treeData, setTreeData] = useState<TTreeNode[]>([]);

    /**
     * @name 编辑器默认的宽度
     */
    const [width, setWidth] = useState(600);

    const selectedDocument = useStore((state) => state.selectedDocument);
    const setSelectedDocument = useStore((state) => state.setSelectedDocument);
    const fetchDocument = useStore((state) => state.fetchDocument);
    const fetchUserInfo = useStore((state) => state.fetchUserInfo);

    const closeLoading = useStore((state) => state.closeLoading);
    const openLoading = useStore((state) => state.openLoading);

    /**
     * @name 存储原始的单个文档
     */
    const [documentRef, setDocumentRef] = useState<Partial<TTreeNode>>({});

    const getDocuments = async () => {
        openLoading();
        const res: any = await getDocumentsApi(projectId);
        const data = res.data;
        setDocuments(data);
        closeLoading();
    }

    const getFolders = async () => {
        openLoading();
        const res: any = await getFoldersApi(projectId);
        const data = res.data;
        setFolders(data);
        closeLoading();
    }

    const getInitFetch = useCallback(async () => {
        openLoading();
        await Promise.all([getFolders(), getDocuments()]);
        closeLoading();
    }, [projectId])

    /**
     * @name 获取单个文档详情
     */

    const getDocument = async (id: string | number) => {
        openLoading();
        const resData = await fetchDocument(getDocumentApi, id);
        // documentRef.current = resData;
        setDocumentRef(resData);
        closeLoading();
    }

    /**
     * @name 计算左侧的结构树
     */
    useEffect(() => {
        setTreeData(folders.map((item) => {
            return {
                id: item.id,
                name: item.name,
                key: item.id,
                nodeType: 'folder',
                projectId: item.projectId,
                children: documents.filter(document => document.folderId === item.id).map((document) => {
                    return {
                        id: document.id,
                        name: document.name,
                        protocol: document.protocol,
                        scheduleId: document.scheduleId,
                        key: `${projectId}-${item.id}-${document.id}`,
                        nodeType: 'document',
                        path: document.path,
                        description: document.description,
                        type: document.type,
                        content: document.content,
                        method: document.method,
                        isLeaf: true,
                    };
                }),
            } as TTreeNode;
        })
            .concat(documents.filter(document => !document.folderId).map((document) => {
                return {
                    id: document.id,
                    name: document.name,
                    protocol: document.protocol,
                    scheduleId: document.scheduleId,
                    key: `${projectId}-${document.id}`,
                    nodeType: 'document',
                    path: document.path,
                    description: document.description,
                    type: document.type,
                    content: document.content,
                    method: document.method,
                    isLeaf: true,
                };
            })))
    }, [folders, documents]);

    useEffect(() => {
        if (!projectId) {
            return;
        }
        getInitFetch();
        return () => {
            setSelectedDocument(state => {
                state.selectedDocument = {}
            })
        }
    }, [projectId])

    /**
     * @name 左侧文档数变更
     */
    const onHandleTreeDataChange = (data: any) => {
        setTreeData(data);
    }

    /**
     * @name 保存文档
     */
    const onHandleSave = async () => {
        openLoading();
        const res: any = await createDocumentApi(selectedDocument);

        if (res.code === 200) {
            message.success('保存成功');
            getDocument(res.data.id);
            getInitFetch();
        }
        closeLoading();
    }

    /**
     * @name 更新文档
     */

    const onHandleUpdate = async (document: any) => {
        // 从左侧文档树获取type为new的文档
        try {
            openLoading();
            const Schema = z.object({
                path: z.string().min(1, '路径不能为空'),
                content: z.string().min(1, '文档内容不能为空').refine(value => {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch (err) {
                        return false;
                    }
                }, '文档内容格式错误'),
            })
            const validataResult = Schema.safeParse(document);
            // 验证不通过的情况下，不做任何操作
            if (!validataResult.success) {
                notification.error({
                    message: '提示',
                    description: validataResult.error.issues.map(v => v.message).join('\br'),
                })
                return;
            }
            const res: any = await updateDocumentApi(document.id, document);
            if (res.code === 200) {
                message.success('保存成功');
                await Promise.all([getDocument(document.id), getInitFetch()])
            }
        } finally {
            closeLoading();
        }
        
    }

    /**
     * @name 查找数据里面新的节点并且删除
     */
    const findTreeDataNewTypeNodeAndDelete = () => {
        const lastData = editArray(treeData, (draft) => {
            const currentNode: any = df.findNode(draft, (dataItem: any) => dataItem?.children?.some((item: any) => item.nodeType === 'new') || dataItem.nodeType === 'new');
            if (currentNode) {
                if (currentNode.children) {
                    remove(currentNode.children, { nodeType: 'new' });
                } else {
                    remove(draft, { id: currentNode.id });
                }
            }
        });
        setTreeData(lastData);
    }

    /**
     * @name 删除文档
     */

    const onHandleDeleteDocument = async (id: string | number) => {
        openLoading();
        const res: any = await deleteDocumentApi(id);

        if (res.code === 200) {
            message.success('删除成功');
            getInitFetch();
            fetchUserInfo(getCurrentUserApi);
            // 如果删除的是当前文档，则清空选择的文档内容
            if (id === selectedDocument.id) {
                setSelectedDocument(state => {
                    state.selectedDocument = {}
                })
            }
        }
        closeLoading();
    }

    /**
     * @name 更新type类型为new的文档
     */
    const onChangeSelectDocument = (key: string, value?: any) => {
        setSelectedDocument((state) => {
            state.selectedDocument[key] = value;
        })
    }


    /**
     * @name 切换文档
     */

    const onHandleSelectDocument = async (item: any) => {
        // 如果当前文档已经是选中的文档，不做任何操作
        if (selectedDocument.id === item.id) {
            return;
        }
        // 切换文档时检查是否有新节点没有保存
        const newTypeNode = df.findNode(treeData, (dataItem: any) => dataItem.nodeType === 'new');
        const isDiffDocument = !isEqual(selectedDocument, documentRef);
        if (newTypeNode) {
            return Modal.confirm({
                title: '提示',
                content: '当前文档内容未保存，继续操作会导致当前数据丢弃？',
                onOk: () => {
                    findTreeDataNewTypeNodeAndDelete();
                    getDocument(item.id);
                }
            });
        }

        if (isDiffDocument && !isEmpty(selectedDocument)) {
            return Modal.confirm({
                title: '提示',
                content: '当前文档内容未保存，继续操作会导致当前数据丢弃？',
                onOk: () => {
                    getDocument(item.id);
                }
            });
        }

        getDocument(item.id);
    }


    return (
        <div className="flex w-full overflow-hidden">
            <div className="border-r overflow-hidden h-full">
                <TreeSilder
                    data={treeData}
                    projectId={projectId}
                    selectedDcoument={selectedDocument}
                    onChange={onHandleTreeDataChange}
                    onOk={getInitFetch}
                    onDocumentSelect={onHandleSelectDocument}
                    onDeleteDocument={onHandleDeleteDocument}
                    onDetailDocument={getDocument}
                    onFindTreeDataNewTypeNodeAndDelete={findTreeDataNewTypeNodeAndDelete}
                    onHandleUpdate={onHandleUpdate}
                />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                {
                    isEmpty(selectedDocument)
                        ?
                        (<EmptyEditor />)
                        :
                        (
                            <>
                                <div className="flex gap-10 p-2 justify-between items-center border-b z-10">
                                    <div className="flex-1">
                                        <Space>
                                            <ConfigProvider
                                                theme={{
                                                    components: {
                                                    }
                                                }}
                                            >
                                                <Select defaultValue={1} dropdownStyle={{ width: 'auto' }} suffixIcon={null} variant="borderless" value={selectedDocument.protocal} className="h-[20px]" disabled style={{ backgroundColor: 'transparent', color: 'white' }}>
                                                    <Select.Option value={1}>
                                                        HTTP://
                                                    </Select.Option>
                                                    <Select.Option value={2}>
                                                        WSS://
                                                    </Select.Option>
                                                </Select>
                                            </ConfigProvider>
                                            <Input
                                                size="small"
                                                placeholder="请输入文档路径"
                                                value={selectedDocument.path}
                                                onChange={e => onChangeSelectDocument('path', e.target.value)}
                                                className="text-sm border-none focus:shadow-none focus:border-none"
                                            />
                                        </Space>
                                    </div>
                                    <div className="flex gap-10 text-sm text-gray-500">
                                        <div className="flex text-nowrap items-center gap-2">
                                            {/* <span>文档类型</span> */}
                                            <Checkbox checked={selectedDocument.useTemplate === 1} onChange={e => onChangeSelectDocument('useTemplate', e.target.checked ? 1 : 2)}>
                                                使用模版
                                            </Checkbox>
                                            <Button.Group>
                                                <Button
                                                    type={selectedDocument.type === 0 ? 'default' : 'primary'}
                                                    size="small"
                                                    className="text-sm"
                                                    onClick={() => onChangeSelectDocument('type', 1)}
                                                >
                                                    JSON
                                                </Button>
                                                <Button
                                                    type={selectedDocument.type === 0 ? 'primary' : 'default'}
                                                    size="small"
                                                    className="text-sm"
                                                    onClick={() => onChangeSelectDocument('type', 0)}
                                                >
                                                    MOCK
                                                </Button>
                                            </Button.Group>
                                        </div>
                                        {/* <div className="flex text-nowrap items-center gap-2 text-sm text-gray-500">
                                            <span>备注:</span>
                                            <Input
                                                size="small"
                                                placeholder="请输入备注"
                                                className="text-sm border-x-transparent border-t-transparent hover:border-x-transparent hover:border-t-transparent focus:border-x-transparent focus:border-t-transparent focus:shadow-none"
                                                value={selectedDocument.description}
                                                onChange={e => onChangeSelectDocument('description', e.target.value)}
                                            />
                                        </div> */}
                                    </div>
                                    <div className="flex gap-2">
                                        <Space.Compact block>
                                            <ExportDocument id={selectedDocument.id} />
                                            <DocumentRequestButton
                                                selectedDocument={selectedDocument}
                                            >
                                                {
                                                    (_, setVisible) => {
                                                        return (
                                                            <Button
                                                                onClick={() => setVisible(true)}
                                                            >
                                                                查看请求
                                                            </Button>
                                                        )
                                                    }
                                                }
                                            </DocumentRequestButton>
                                            <DocumentLogButton
                                                selectedDocument={selectedDocument}
                                            >
                                                {
                                                    (_, setVisible) => {
                                                        return (
                                                            <Button
                                                                onClick={() => setVisible(true)}
                                                            >
                                                                查看日志
                                                            </Button>
                                                        )
                                                    }
                                                }
                                            </DocumentLogButton>
                                            <ScheduleButton
                                                disabled={selectedDocument.nodeType === 'new'}
                                                scheduleId={selectedDocument.scheduleId}
                                                onSave={(scheduleId) => {
                                                    setSelectedDocument(state => {
                                                        state.selectedDocument.scheduleId = scheduleId;
                                                    })
                                                }}
                                            />
                                        </Space.Compact>
                                        {
                                            selectedDocument.nodeType === 'new'
                                                ? (
                                                    <Button type="primary" icon={<AiOutlineSave />} disabled={isEqual(selectedDocument, documentRef)} onClick={onHandleSave}>保存</Button>
                                                )
                                                : (
                                                    <Button type="primary" icon={<AiOutlineSave />} disabled={isEqual(selectedDocument, documentRef)} onClick={() => onHandleUpdate(selectedDocument)}>保存</Button>
                                                )
                                        }
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden shadow">
                                    <Splitter className="flex" onResize={([leftSize]) => setWidth(leftSize)}>
                                        <Splitter.Panel resizable={true} defaultSize="600">
                                            <Editor
                                                width={width}
                                                value={selectedDocument.content}
                                                onChange={code => onChangeSelectDocument('content', code)}
                                            />
                                        </Splitter.Panel>
                                        <Splitter.Panel className="h-full" min={200}>
                                            <CodeRender selectedDocument={selectedDocument} />
                                        </Splitter.Panel>
                                    </Splitter>
                                </div>
                            </>
                        )
                }
            </div>
        </div>
    );
}

export default ProjectDetail;