import { Tree, Input, ConfigProvider, Button } from 'antd';
import { AiOutlinePlusSquare, AiOutlineFolderAdd } from "react-icons/ai";
import React, { useState, useRef, useMemo } from 'react';
import cs from 'classnames';
import df from 'd-forest';
import useTheme from '../../../../hooks/themeContext';
import DocumentTitle from './DocumentTitle';
import { AiOutlineSearch } from 'react-icons/ai';
import { editArray, getId } from '../../../../utils/index';
import type { TTreeNode } from '../../../../index';
import CreateFolderButton from './CreateFolderButton';
import NewTreeInput from './NewTreeInput';
import useStore from '../../../../store';
import FolderTitle from './FolderTitle';
import DocumentOnContextMenu from './DocumentOnContextMenu';


interface IProps {
    data: TTreeNode[];
    projectId?: string;
    selectedDcoument: any; // 选择的文档对象
    onChange?: (data: TTreeNode[]) => void;
    onDocumentSelect: (item: any) => void;
    onDeleteDocument: (id: string | number) => void;
    onDetailDocument: (id: string | number) => Promise<void>;
    onFindTreeDataNewTypeNodeAndDelete: () => void;
    onHandleUpdate: (document: any) => Promise<void>;
    onOk?: () => void;
}


const TreeSilder: React.FC<IProps> = (props: IProps) => {
    const { data } = props;
    const { theme } = useTheme();

    const selectedDcoument = useStore((state) => state.selectedDocument);
    const setSelectedDocument = useStore((state) => state.setSelectedDocument);

    const [hoverDocument, setHoverDocument] = useState<Record<string, any>>({});

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [searchValue, setSearchValue] = useState('');

    const [autoExpandParent, setAutoExpandParent] = useState(false);

    const [expandedKeys, setExpandedKeys] = useState<any>([]);

    /**
     * @name 点击新增文档按钮
     * @param item 
     * @returns 
     */
    const onHandleAddNewDocument = (item: any, e: any) => {
        e.stopPropagation();
        props.onFindTreeDataNewTypeNodeAndDelete();
        const $id = getId();
        const newItem: TTreeNode = {
            name: '',
            key: $id,
            id: $id,
            protocal: 1,
            nodeType: 'new',
            folderId: item.id,
            projectId: props.projectId,
            isLeaf: true
        };
        const latestData = editArray(data, (draft: any) => {
            if (item.key) {
                const curentNode: any = df.findNode(draft, (dataItem) => dataItem.key === item.key);
                curentNode.children.push(newItem);
            } else {
                draft.push(newItem);
            }
        });
        props.onChange && props.onChange(latestData);
        // props.onDocumentChange && props.onDocumentChange(newItem);
        setSelectedDocument(state => {
            state.selectedDocument = newItem;
        });
        // 展开节点
        
        if (item.key) {
            setExpandedKeys([...new Set([...expandedKeys, item.key])]);
            setAutoExpandParent(true);
        }
        // 聚焦到文本框
        setTimeout(() => {
            // 聚焦到文本框
            inputRef.current && inputRef.current.focus();
        }, 500)
        
    }

    /**
     * @name 新增文档的文本框内容变更
     * @param item 
     * @returns 
     */
    const onHandleNewInputChange = (v: string) => {
        // props.onDocumentChange && props.onDocumentChange((data) => {
        //     return {
        //        ...data,
        //         name: v
        //     }
        // });

        setSelectedDocument(state => {
            state.selectedDocument.name = v;
        })
        
    }

    /**
     * @name 新增文档的文本框失去焦点
     * @param item 
     * @returns 
     */

    const onHandleNewInputBlur = (e: any) => {
        if (!e.target.value) {
            props.onFindTreeDataNewTypeNodeAndDelete();
            setSelectedDocument(state => {
                state.selectedDocument = {};
            })
        }
    }

    /**
     * @name 修改文本标题文本框失去焦点
     * @param item 
     * @returns 
     */

    const onHandleDocumentTitleBlur = async (title: string) => {
        await props.onHandleUpdate({
            ...selectedDcoument,
            name: title
        });
    }

    const titleRender = (item: any) => {
        /**
         * 下面是文件夹内的渲染逻辑
         */
        if (item.children) {
            return <FolderTitle item={item} onHandleAddNewDocument={onHandleAddNewDocument} />
        }
        /**
         * 下面是新建文档的渲染逻辑
         */
        if (item.nodeType === 'new') {
            return (
                <NewTreeInput
                    ref={inputRef}
                    key={selectedDcoument.key}
                    value={selectedDcoument.name}
                    onChange={(v: string) => onHandleNewInputChange(v)}
                    onBlur={onHandleNewInputBlur}
                />
            )
        }
        /**
         * 下面是文档条目的渲染逻辑
         */
        return (
            <div
                className={`flex items-center justify-between h-full`}
                style={{ color: hoverDocument.id === item.id ? theme.primary as any : false}}
                key={item.id}
                onMouseOver={() => setHoverDocument(item)}
                onMouseLeave={() => setHoverDocument({})}
            >
                <DocumentTitle
                    className={cs({ [`text-[${theme.primary}]`]: selectedDcoument.id === item.id }, 'truncate text-sm')}
                    title={item.name}
                    method={item.method}
                    onDelete={() => props.onDeleteDocument(item.id)}
                    onBlur={onHandleDocumentTitleBlur}
                    onClick={() => props.onDocumentSelect(item)}
                />
            </div>
        )
    }

    /**
     * @name 搜索框的搜索逻辑
     */

    const onSearchChange = (value: string) => {
        setSearchValue(value);
    }

    /**
     * @name 根据搜索框的内容来显示搜索内容
     */
    const searchResultData = useMemo(() => {
        if (searchValue === '') {
            setAutoExpandParent(false);
            // setExpandedKeys([]);
            return data;
        }
        const keys: any[] = [];
        return editArray(data, (draft: any) => {
            df.forEachNode(draft, (item: any) => {
                if (item.children && item.children.length > 0 && item.children.some((child: any) => new RegExp(searchValue, 'i').test(child.name))) {
                    keys.push(item.key);
                }
            })
            setExpandedKeys(keys);
            setAutoExpandParent(true);
        })
    }, [data, searchValue]);

    return (
        <div className='flex flex-col h-full w-[200px] overflow-hidden'>
            <div className='border-b p-2 flex items-center justify-between text-sm'>
                {/* <h2>文件</h2> */}
                <Input
                    prefix={<AiOutlineSearch className='text-gray-300' />}
                    size='small'
                    allowClear
                    onChange={(e) => onSearchChange(e.target.value)}
                    className='border-none text-sm rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200 focus:shadow-none py-1 px-4'
                />
                <div className='flex gap-2 items-center ml-2'>
                    <Button variant='link' color='primary' className='text-[16px] p-0' onClick={(e) => onHandleAddNewDocument({}, e)}>
                        <AiOutlinePlusSquare />
                    </Button>
                    <CreateFolderButton
                        projectId={props.projectId}
                        onOk={props.onOk}
                    >
                        {
                            (_, setVisible) => (
                                <Button className='text-[18px] p-0' variant='link' color='primary' onClick={() => setVisible(true)}>
                                    <AiOutlineFolderAdd />
                                </Button>
                            )
                        }
                    </CreateFolderButton>
                </div>
            </div>
            <DocumentOnContextMenu
                menus={[{
                    key: '1',
                    label: '新建文档2',
                    onClick: (_, { domEvent }) => {
                        onHandleAddNewDocument(selectedDcoument, domEvent);
                    }
                }]}
            >
                <div className='flex-1 overflow-y-auto'>
                    <ConfigProvider
                        theme={{
                            components: {
                                Tree: {
                                    nodeHoverBg: 'transparent'
                                }
                            }
                        }}
                    >
                        <Tree.DirectoryTree
                            multiple
                            defaultExpandAll
                            selectable={false}
                            treeData={searchResultData}
                            titleRender={titleRender}
                            rootClassName='project-tree'
                            fieldNames={{
                                title: 'name',
                                children: 'children',
                                key: 'key'
                            }}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onExpand={(keys) => setExpandedKeys(keys)}
                        />
                    </ConfigProvider>
                </div>
            </DocumentOnContextMenu>
        </div>
    )
}

export default React.memo(TreeSilder);