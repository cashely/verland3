import { Pagination, Table, Empty, Button, Space, Flex } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useEffect, useState } from 'react'
import _ from 'lodash-es'
// interface DataType<T> {
//     key: React.Key;
//     [key: string]: T;
//   }

export default (props: TableProps & {
    custom: {
        showHeader?: boolean,
    
    }
}) => {

    const { columns, dataSource, custom = {
        showHeader: true
    }, ...otherConfig } = props
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //设置默认keys
    useEffect(() => {
        if (otherConfig?.rowSelection?.defaultSelectedRowKeys) {
            setSelectedRowKeys(otherConfig?.rowSelection?.defaultSelectedRowKeys)
        }
    }, [])
    const tableConfig = {
        rowKey: "id",
        bordered: true,
        loading: false,
        scroll: { x: 'max-content' },
        //表格行选择
        rowSelection: otherConfig?.rowSelection ? {
            // type: 'checkbox',
            selections: [{
                key: Table.SELECTION_ALL,
                text: '全选',
                onSelect: (allKeys: React.Key[]) => setSelectedRowKeys(allKeys)
            },
            {
                key: Table.SELECTION_INVERT,
                text: '反选',
                onSelect: (allKeys: React.Key[]) => setSelectedRowKeys(allKeys.filter(key => !selectedRowKeys.includes(key)))
            },
            {
                key: Table.SELECTION_NONE,
                text: '清空',
                onSelect: () => setSelectedRowKeys([]),
            }],
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
                console.log(`rowSelection---selectedRowKeys: ${selectedRowKeys}`);
                setSelectedRowKeys(newSelectedRowKeys)
            },
            ...otherConfig?.rowSelection
        } : false,
        //分页、排序、筛选变化时触发
        onChange(pagination, filters, sorter, extra: { currentDataSource: [], action: paginate | sort | filter }) {
            console.log(pagination, filters, sorter, extra)
        },
        //点击某一行触发
        onRow: (record) => ({
            onClick: (event) => {
                // console.log(record)
            }
        }),
        locale: () => ({ emptyText: <Empty description="No Data"></Empty>, }),
        pagination: {
            total: dataSource?.length,
            showTotal: (total: number) => `共${total}条`,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                console.log(current, pageSize);
            },
        },
        ..._.omit(otherConfig, ['rowSelection']),
    }
    return (<section className={
        'bg-white rounded px-[16px] pt-[16px] flex-1 overflow-hidden'
    }>
        {custom?.showHeader ? <div className={'tableHeader'} style={{ marginBottom: 16 }}>
            {/* <Space className={'flex items-right'}> */}
            <Flex justify={'flex-end'} >
                <Button onClick={props?.handleImport} type="default" style={{ marginRight: 6 }}>
                    导入
                </Button>
                <Button onClick={props?.handleExport} type="default" style={{ marginRight: 6 }}>
                    导出
                </Button>
                <Button onClick={props?.handleAdd} type="primary">
                    新增
                </Button>
            </Flex>
            {/* </Space> */}
        </div> : null}
        <Table<T> columns={columns} dataSource={dataSource} {...tableConfig} ></Table>
    </section>)
}