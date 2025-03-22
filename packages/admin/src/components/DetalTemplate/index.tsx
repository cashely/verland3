import { Descriptions, Card } from 'antd';
import dayjs from 'dayjs';

export default function DetailTemplate(props: any) {
    const { items, detailInfo = {} } = props

    const childrenRender = (obj, item) => {
        const value = obj[item.prop]
        if (!value) return '-'
        if (item.type === 'datetime') {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        } else if (item.type === 'price') {
            return `¥${(value / 100).toFixed(2).toLocaleString()}`
        }
        return value
    }

    const formateData = (obj: any) => {
        if (!obj?.id) return [];
        return items.map((item: any) => ({
            key: item.prop,
            label: item.label,
            children: item?.render?.(obj[item.prop]) ?? childrenRender(obj, item)
        }))
    }
    return (
        <Card className='page-detail' title="详情">
            <Descriptions layout='vertical' items={formateData(detailInfo)} />
        </Card>

    );
}
