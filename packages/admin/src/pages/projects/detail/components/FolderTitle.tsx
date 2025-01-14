import type { MouseEvent } from 'react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import DocumentOnContextMenu from './DocumentOnContextMenu';
interface FolderTitleProps {
    item: any;
    onHandleAddNewDocument: (item: any, e: MouseEvent<Element>) => void;
}

const FolderTitle = (props: FolderTitleProps) => {
    const { item, onHandleAddNewDocument } = props;
    return (
        <DocumentOnContextMenu
            menus={[
                {
                    key: '1',
                    label: '新建文档',
                    onClick: (_, { domEvent }) => {
                        onHandleAddNewDocument(item, domEvent);
                    }
                },
                {
                    key: '3',
                    label: '重命名',
                    onClick: (_, { domEvent }) => {
                        onHandleAddNewDocument(item, domEvent);
                    }
                },
                {
                    key: '2',
                    label: '删除',
                    onClick: () => { }
                }
            ]}
        >
            <div className='flex items-center justify-between hover:bg-[transparent]' key={item.key}>
                <span>{item.name}</span>
            </div>
        </DocumentOnContextMenu>
    )
}

export default FolderTitle;