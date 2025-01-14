import { memo } from 'react';
import { Empty, Spin } from 'antd';

interface IProps {
    loading?: boolean;
}

const EmptyEditor: React.FC = (props: IProps) => {
    const { loading = false } = props;
    return (
        <div className='flex flex-col items-center justify-center h-full'>
           <Spin spinning={loading}>
                <Empty />
            </Spin>
        </div>
    )
}

export default memo<IProps>(EmptyEditor);