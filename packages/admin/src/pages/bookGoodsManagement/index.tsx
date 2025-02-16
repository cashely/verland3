import SearchForm from "@/components/SearchForm";
import TableList from '@/components/TableList'
import { searchConfig, tableColumns, tableDataSource } from './config.tsx'
import { useNavigate } from "react-router"; 'react-router-dom'


export default function appointManagement() {
    const navigate = useNavigate()
    
    const tableConfig = {
        custom: {
            showHeader: true
        },
        handleAdd(){
            navigate('/bookGoodsManagement/editOrAdd')
        }
    }
    return (
        <>
            <SearchForm formList={searchConfig} />
            <div className="mt-[20px] bg-[#f5f5f5] flex flex-1">
                <TableList columns={tableColumns} dataSource={tableDataSource} {...tableConfig}>

                    {/* {
                       [
                        {
                            content: <div>1</div>
                        }
                       ]
                    } */}

                </TableList>
            </div>
        </>
    );
}
