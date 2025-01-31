import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "@/components/SearchForm";
import TableList from '@/components/TableList'
import { searchConfig, tableColumns, tableDataSource } from './config.tsx'

export default function appointManagement() {
  const navigate = useNavigate()
  const tableConfig = {
    rowSelection: {
      defaultSelectedRowKeys: ['1'],
      // selections:true
    }
  }
  const handleAdd = () => {
    navigate('/appointManagement/editAdd')
  }
  return (
    <>
      <SearchForm formList={searchConfig} />
      <div className="mt-[20px] bg-[#f5f5f5]">
        <TableList columns={tableColumns} dataSource={tableDataSource} {...tableConfig} handleAdd={handleAdd} />
      </div>
    </>
  );
}
