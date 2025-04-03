import React, { useEffect, useState } from 'react';
import { Table, Empty, Image, Tag } from 'antd';
import type {
  PaginationProps,
  TableColumnProps,
  GetProp,
  TableProps,
} from 'antd';
import { timeFormatDateTime } from '@/utils/timeUtils';
import { getLabelByValue } from '@/constants';
import { createStyles } from 'antd-style';
import { FILE_URL } from '@/apis/request';
import _ from 'lodash-es';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { formatPrice } from '@/utils';

type CellEllipsisType = GetProp<TableColumnProps, 'ellipsis'>;

interface DataType {
  // render: () => React.ReactNode;
  [key: string]: any;
}

// TableProps<DataType>['columns'] &
type CustomTableColumnProps = TableColumnProps & {
  render?: (text: any, record: any, index: number) => React.ReactNode;
  ellipsis?: CellEllipsisType;
  width?: number;
  dataIndex?: string;
  title?: React.ReactNode;
  showTitle: boolean;
};

type IProps = {
  children?: any;
} & {
  pagination?: PaginationProps | boolean;
  columns: CustomTableColumnProps;
  dataSource: DataType[];
  loading: TableProps<DataType>['loading'];
  rowSelection?: TableProps<DataType>['rowSelection'];
};

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      .ant-table-wrapper {
        height: 100%;
      }
      .ant-spin-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .ant-table {
        overflow: hidden;
      }
      ${antCls}-table {
        overflow: hidden;
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
  const { pagination, columns, dataSource, children, ...otherConfig } = props;
  const { styles } = useStyle();
  const navigate = useNavigate();
  const defaultPagination = {
    size: 'default',
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '200'],
    defaultPageSize: 10,
  };

  const combinedPagination =
    typeof pagination === 'object'
      ? { ...defaultPagination, ...pagination }
      : {};

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //设置默认keys
  useEffect(() => {
    if (otherConfig?.rowSelection?.defaultSelectedRowKeys) {
      setSelectedRowKeys(otherConfig?.rowSelection?.defaultSelectedRowKeys);
    }
    console.log(columns, '---columns', dataSource, '---dataSource');
  }, []);

  const tableConfig: any = {
    rowKey: 'id',
    bordered: true,
    size: 'large',
    scroll: { x: '100%', y: '100%' },
    //表格行选择
    rowSelection: otherConfig?.rowSelection
      ? {
        // type: 'checkbox',
        selections: [
          {
            key: Table.SELECTION_ALL,
            text: '全选',
            onSelect: (allKeys: React.Key[]) => setSelectedRowKeys(allKeys),
          },
          {
            key: Table.SELECTION_INVERT,
            text: '反选',
            onSelect: (allKeys: React.Key[]) =>
              setSelectedRowKeys(
                allKeys.filter((key) => !selectedRowKeys.includes(key))
              ),
          },
          {
            key: Table.SELECTION_NONE,
            text: '清空',
            onSelect: () => setSelectedRowKeys([]),
          },
        ],
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
          console.log(`rowSelection---selectedRowKeys: ${selectedRowKeys}`);
          setSelectedRowKeys(newSelectedRowKeys);
        },
        ...otherConfig?.rowSelection,
      }
      : false,
    //分页、排序、筛选变化时触发
    // onChange(
    //   pagination,
    //   filters,
    //   sorter,
    //   extra: { currentDataSource: []; action: 'paginate' | 'sort' | 'filter' }
    // ) {
    //   console.log(pagination, filters, sorter, extra);
    // },
    //点击某一行触发
    // onRow: (record) => ({
    //   onClick: (event) => {
    //     // console.log(record)
    //   },
    // }),
    locale: () => ({ emptyText: <Empty description="No Data"></Empty> }),
    pagination: {
      showTotal: (total: number) => `共${total}条`,
      onShowSizeChange: (current: number, pageSize: number) => {
        console.log(current, pageSize);
      },
      ...combinedPagination,
    },
    // title: custom.showHeader ? renderTitle : undefined,
    // footer: () => 'Footer',
    ..._.omit(otherConfig, ['rowSelection']),
  };

  //渲染列内容
  const columnRender = (item: DataType, { value }) => {
    if (value) {
      if (item?.slot === 'datetime') {
        return timeFormatDateTime(value);
      } else if (item?.slot === 'image') {
        if (value?.length && value instanceof Array) {
          return (
            <Image.PreviewGroup>
              {value.map((img: any) => (
                <Image
                  key={img.id}
                  src={FILE_URL + '/' + img?.image.path}
                  alt="宠物图片"
                />
              ))}
            </Image.PreviewGroup>
          );
        } else if (value?.path) {
          return (
            <Image
              src={FILE_URL + value?.path}
              alt="缩略图"
              width={60}
              height={60}
            />
          );
        }

        return '-';
      } else if (item.slot === 'select') {
        return getLabelByValue(item?.options || [], value);
      } else if (item.slot === 'tag') {
        return (
          <Tag color={item.tagObj[value]}>
            {getLabelByValue(item?.options || [], value)}
          </Tag>
        );
      } else if (item.slot === 'price') {
        return <Tag color="green">{formatPrice(value)}</Tag>;
      } else if (item.slot === 'file') {
        return (
          <a
            href={FILE_URL + value?.path}
            target="_blank"
            download={item?.title}
            rel="noopener noreferrer"
            style={{
              textDecoration: 'underline',
              color: '#c696da',
              cursor: 'pointer',
            }}
          >
            {item.title}
          </a>
        );
      }
    }
    return value || '-';
  };

  return (
    <div className="table-body">
      <Table<DataType>
        className={styles.customTable}
        dataSource={dataSource}
        {...tableConfig}
      >
        {columns?.map((item: any) => (
          <Table.Column
            width={item.width ?? 160}
            fixed={item.fixed || false}
            title={item.title}
            dataIndex={item.dataIndex}
            ellipsis={{
              showTitle: item.showTitle || false,
            }}
            key={item.key}
            render={(value, record) =>
              item?.render?.(value, record, navigate) ??
              columnRender(item, { value })
            }
          ></Table.Column>
        ))}
        <Table.Column
          title="操作"
          key="action"
          width="140px"
          fixed="right"
          render={(_, record) => props.children?.tableActionRender(_, record)}
        />
      </Table>
    </div>
  );
};
