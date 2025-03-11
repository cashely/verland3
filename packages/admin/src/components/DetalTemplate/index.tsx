import { Descriptions, Card } from 'antd';

export default function DetailTemplate(props: any) {
    const { items, detailInfo = {} } = props

    const formateData = (obj: any) => {
        if (!obj?.id) return [];
        return items.map((item: any) => ({
            key: item.prop,
            label: item.label,
            children: obj[item.prop] || '-'
        }))
    }
    return (
        <Card className='page-detail' title="详情">
            <Descriptions layout='vertical' items={formateData(detailInfo)} />
        </Card>

    );
}
