import { useState } from 'react'
import { Space, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons';
const SearchTools = (props: any) => {
    const { listNum, resetForm } = props

    const [expand, setExpand] = useState(false)

    return <div className='search-tools' style={{ textAlign: 'right' }}>
        <Space size="small">
            <Button
                shape="round"
                onClick={resetForm}
            >
                重置
            </Button>
            <Button type="primary" htmlType="submit" shape="round">
                查询
            </Button>
            {
                listNum > 6 ? <a
                    style={{ fontSize: 12 }}
                    onClick={() => {
                        setExpand(!expand);
                    }}
                >
                    <DownOutlined rotate={expand ? 180 : 0} /> {expand ? "收起" : '展开'}
                </a> : null
            }
        </Space>

    </div>
}

export default SearchTools