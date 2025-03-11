import React, { useEffect, useState } from 'react'
import { Table, Empty, Image, } from 'antd';
import type { PaginationProps, TableColumnsType, TableProps } from 'antd';
import { timeFormatDateTime } from '@/utils/timeUtils'
import { getLabelByValue } from '@/constants'
import { createStyles } from 'antd-style';
import _ from 'lodash-es'
import './index.scss'

interface DataType {
  key: string;
  dataIndex?: string;
  fixed: 'left' | 'right' | false;
  title: string;
  render: () => React.ReactNode;
  [key: string]: any
}

type IProps = {
  children?: (visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode;
} & {
  pagination?: PaginationProps | boolean;
  columns: TableColumnsType<DataType>;
  dataSource: DataType[];
  loading: boolean;
  rowSelection?: TableProps<DataType>['rowSelection'];
}

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      .ant-table-wrapper{
        height:100%;
      }
      .ant-spin-container{
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .ant-table{
        overflow:hidden;
      }
      ${antCls}-table {
        overflow:hidden;
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

export default (props: IProps) => {
  const { pagination, columns, dataSource, children, ...otherConfig } = props
  const { styles } = useStyle();
  const defaultPagination = {
    size: 'default',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    defaultPageSize: 10,
  };

  const combinedPagination = typeof pagination === 'object' ? { ...defaultPagination, ...pagination } : {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //设置默认keys
  useEffect(() => {
    if (otherConfig?.rowSelection?.defaultSelectedRowKeys) {
      setSelectedRowKeys(otherConfig?.rowSelection?.defaultSelectedRowKeys)
    }
  }, [])


  const tableConfig: any = {
    rowKey: "id",
    bordered: true,
    loading: otherConfig.loading ?? false,
    size: 'large',
    scroll: { x: 'max-content', y: '100%' },
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
    onChange(pagination, filters, sorter, extra: { currentDataSource: [], action: 'paginate' | 'sort' | 'filter' }) {
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
      showTotal: (total: number) => `共${total}条`,
      onShowSizeChange: (current, pageSize) => {
        console.log(current, pageSize);
      },
      ...combinedPagination
    },
    // title: custom.showHeader ? renderTitle : undefined,
    // footer: () => 'Footer',
    ..._.omit(otherConfig, ['rowSelection']),
  }

  //渲染列内容
  const handleColumnRender = (item, { value }) => {
    if (value) {
      if (item?.slot === 'datetime') {
        return timeFormatDateTime(value)
      } else if (item?.slot === 'image') {
        return <Image src={value} alt="缩略图" width={100} height={100} />
      } else if (item.slot === 'select') {
        return getLabelByValue(item?.options || [], value)
      }
    }
    return value || '-'
  }


  return (
    <div className='table-body'>
      <Table<DataType> className={styles.customTable} dataSource={dataSource}   {...tableConfig} >
        {
          columns?.map((item, index) =>
            <Table.Column width={160} fixed={item.fixed} title={item.title} dataIndex={item.key} key={index} render={(value, record) => handleColumnRender(item, { value, record })} />
          )
        }
        <Table.Column
          title="操作"
          key="action"
          width={120}
          fixed="right"
          render={(_, record) => props.children?.tableActionRender(_, record)}
        />
      </Table>
    </div >)
}