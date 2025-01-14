import React, { useState, useRef } from 'react';
import { Input, Spin, Popconfirm } from 'antd';
import cs from 'classnames';
import { AiOutlineDelete } from "react-icons/ai";
import { LoadingOutlined } from '@ant-design/icons';
import DocumentOnContextMenu from './DocumentOnContextMenu';

interface IProps {
    title?: string,
    method?: string,
    onClick?: React.MouseEventHandler,
    onDelete?: (e?: React.MouseEvent<HTMLElement>) => void,
    onBlur?: (title: string) => Promise<void>,
    className?: string,
}

function DocumentTitle(props: IProps) {
    const { title, method } = props;

    const inputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<any>('');
    const [editMode, setEditMode] = useState(false);

    /**
     * @name 双击进入编辑模式
     */

    const onDoubleClick = () => {
        setValue(title);
        setEditMode(true);
        setTimeout(() => {
            inputRef.current && (inputRef.current as HTMLInputElement).focus();
        }, 100)
    }

    /**
     * @name 失去焦点
     */

    const onBlur = async () => {
        if (title === value) {
            setEditMode(false);
            return;
        }
        setLoading(true);
        props.onBlur && await props.onBlur(value);
        setEditMode(false);
        setLoading(false);
    }

    /**
     * @name 转换当前文档的请求方式
     */
    const transformMethod = (method?: String) => {
        switch (true) {
            case ['0'].includes(String(method)):
                return 'ALL';
            case String(method) === '2':
                return 'POST';
            case String(method) === '3':
                return 'PUT';
            case String(method) === '4':
                return 'DELETE';
            default:
                return 'GET';
        }
    }

    return (
        <DocumentOnContextMenu
            menus={
                [{
                    key: '1',
                    label: '删除',
                    onClick: props.onDelete
                }]
            }
        >
            <>
                {
                    editMode ? (
                        <Input
                            ref={inputRef}
                            size='small'
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={onBlur}
                            suffix={loading ? <Spin indicator={<LoadingOutlined spin />} /> : null}
                            className='border-none focus:shadow-none focus:border-none bg-gray-200 hover:bg-gray-200 focus:bg-gray-200 rounded-sm text-sm px-2 py-1'
                        />
                    ) : (
                        <div
                            className='flex items-center justify-between w-full'
                        >
                            <span className='rounded p-0.5 bg-green-500 text-white mr-1 leading-none'>{transformMethod(method)}</span>
                            <span className={cs(props.className, 'flex-1')} onDoubleClick={onDoubleClick} onClick={props.onClick}>{title}</span>
                        </div>
                    )
                }
            </>
        </DocumentOnContextMenu>
    );
}

export default DocumentTitle;