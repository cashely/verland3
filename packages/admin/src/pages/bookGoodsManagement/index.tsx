import SearchForm from "@/components/SearchForm";
import TableList from '@/components/TableList'
import { searchConfig, tableColumns, tableDataSource } from './config.tsx'

export default function appointManagement() {
    
    const tableConfig = {
        custom: {
            showHeader: false
        }
    }
    return (
        <>
            <SearchForm formList={searchConfig} />
            <div className="mt-[20px] bg-[#f5f5f5] flex flex-1">
                <TableList columns={tableColumns} dataSource={tableDataSource} {...tableConfig} />
            </div>
        </>
    );
}
