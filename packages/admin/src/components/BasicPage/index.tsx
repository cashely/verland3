import React, { useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Button, Space, Flex } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface';
import SearchForm from '@/components/SearchForm'
import TableList from '@/components/TableList'
import type { MyResponse } from '@/apis/request'
import { PageData } from '@/types'
import './index.scss'

export type MyPageTableOptions<S> = ColumnsType<S>;
type ParseDataType<S> = S extends (params?: any) => MyResponse<PageData<infer T>> ? T : S;
export interface PageProps<S> {
  ref?: React.Ref<RefPageProps>,
  pageApi?: S;
  pageParams?: object;
  searchItems?: SearchForm.searchItems;
  tableOptions?: MyPageTableOptions<ParseDataType<S>>;
  tableRender?: (data: MyPageTableOptions<ParseDataType<S>>[]) => React.ReactNode;
}
export interface RefPageProps {
  load: (data?: object) => Promise<void>;
}

const BasicPage = ({
  pageApi,
  pageParams,
  searchItems,
  tableOptions,
  children,
}: PageProps<S>, ref: { ref?: React.Ref<RefPageProps> }) => {

  const [pageData, setPageData] = useState<PageData<ParseDataType<S>>>({
    pageSize: 20,
    pageNum: 1,
    total: 0,
    data: [],
  })

  const [tableLoading, setTableLoading] = useState(false)

  //获取表格数据
  const getPageData = useCallback(
    async (params: Record<string, any> = {}) => {

      if (pageApi) {
        setTableLoading(true)
        const obj = {
          ...params,
          ...pageParams,
          pageSize: pageData.pageSize,
          pageNum: pageData.pageNum,
        };
        const { code, data, } = await pageApi(obj);
        setTableLoading(false)
        if (code === 200) {
          setPageData({
            ...pageData,
            total: data?.length || 0,
            data
          });
        }
      }
    },
    [pageApi, pageParams, pageData.pageSize, pageData.pageNum,],
  );

  const onSearch = (searchParams: Record<string, any>) => {
    getPageData(searchParams);
  };

  const onPageChange = (pageNum: number, pageSize?: number) => {
    setPageData({
      ...pageData,
      pageNum,
      pageSize
    });
  }

  useImperativeHandle(ref, () => ({
    load: (data?: object) => getPageData(data)
  }), [])

  console.log(children, '_--------------')

  //初始化数据
  useEffect(() => {
    getPageData();
  }, [getPageData]);


  return (
    <section className='page-box'>
      <section className='search-box'>
        <SearchForm onSearch={onSearch} items={searchItems} />
      </section>
      <section className='table-box bg-[#f5f5f5] flex flex-1'>
        <div className={
          'content bg-white rounded px-[16px] pt-[16px] flex-1 overflow-hidden'
        }>
          {
            children?.tableHeader?.length ?
              <div className='table-header' >
                {/* <Space className={'flex items-right'}> */}
                <Flex justify={'flex-end'} >
                  {
                    children.tableHeader.map((item, index) => (
                      <Button onClick={item.onClick} key={index} type={item.type} style={{ marginRight: 6 }}>{item.label}</Button>
                    ))
                  }
                </Flex>
                {/* </Space> */}
              </div> : null
          }
          <TableList
            height="100%"
            dataSource={pageData.data}
            columns={tableOptions}
            loading={tableLoading}
            pagination={{
              current: pageData.pageNum,
              pageSize: pageData.pageSize,
              total: pageData.total,
              onChange: onPageChange,
            }} >
            {
              children.showColumnActions && {
                tableActionRender: children.showColumnActions
              }
            }
          </TableList>
        </div>
      </section>

    </section>
  )
}

export default forwardRef(BasicPage)