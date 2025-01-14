import { MouseEventHandler, ReactNode, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { Dropdown, ConfigProvider } from 'antd';

interface IMenu {
    key: string;
    label: string;
    onClick?: (...args: any[]) => void;
}

interface IProps {
    children?: ReactNode;
    menus: IMenu[];
    data?: any;
}

/**
 * @name 文档标题右键菜单
 */
const DocumentOnContextMenu = (props: IProps) => {
    const { children, menus } = props;

    const menuRef = useRef<any>(null);

    /**
     * @name 右键菜单
     */
    const onContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        portalMenu(e);
    }

    /**
     * @name 渲染菜单
     */
    const portalMenu: MouseEventHandler<HTMLDivElement> = (e) => {
        const { pageX, pageY } = e;
        menuRef.current = document.createElement('div');
        Object.assign(menuRef.current.style, {
            position: 'fixed',
            top: `${pageY}px`,
            left: `${pageX}px`,
            zIndex: 999,
            whiteSpace: 'nowrap'
        })
        const root = createRoot(menuRef.current);
        root.render(
            <DropDownMenu
                onMouseover={removeMenu}
                menus={menus}
                container={menuRef.current}
                data={props.data}
            />
        );
        menuRef.current.onclick = removeMenu;
        window.addEventListener('click', removeMenu, false);
        document.body.appendChild(menuRef.current);
    };

    function removeMenu() {
        document.body.removeChild(menuRef.current);
        window.removeEventListener('click', removeMenu, false);
    }


    return (
        <div className="w-full" onContextMenu={onContextMenu}>
            {children}
        </div>
    )
}


function DropDownMenu(props: {
    onMouseover: (div: HTMLDivElement) => void,
    menus: IMenu[],
    container: HTMLDivElement,
    data: any
}) {
    const { menus } = props;
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontSize: 12,

                    borderRadius: 2
                },
                components: {
                    Dropdown: {
                        paddingBlock: 3,
                        boxShadowSecondary: '0px 2px 5px rgba(0,0,0,.1)',
                    }
                }
            }}
        >
            <Dropdown
                open={true}
                destroyPopupOnHide
                getPopupContainer={() => props.container}
                menu={{
                    items: menus.map(item => ({
                        ...item,
                        onClick: (info) => {
                            item.onClick && item.onClick.call(null, props.data, info);
                        }
                    })),
                }}
            >
                <span></span>
            </Dropdown>
        </ConfigProvider>
    );
}

export default DocumentOnContextMenu;