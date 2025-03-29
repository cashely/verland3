import { Descriptions, Card, Image } from 'antd';
import dayjs from 'dayjs';
import { FILE_URL } from '@/apis/request';

export default function DetailTemplate(props: any) {
  const { items, detailInfo = {} } = props;

  const childrenRender = (obj, item) => {
    const value = obj[item.prop];
    if (item.type === 'datetime') {
      console.log(value);
      return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';
    } else if (item.type === 'price') {
      if (Number.isInteger(value)) {
        return `¥${(value / 100).toFixed(2).toLocaleString()}`;
      }
      return '-';
    } else if (item.type === 'image') {
      if (!value?.path) return '-';
      return <Image src={FILE_URL + value?.path} alt="缩略图" height={140} />;
    }
    return value || '-';
  };

  const formateData = (obj: any) => {
    if (!obj?.id) return [];
    return items.map((item: any) => ({
      key: item.prop,
      label: item.label,
      children: item?.render?.(obj[item.prop]) ?? childrenRender(obj, item),
    }));
  };
  return (
    <Card className="page-detail" title="详情">
      <Descriptions layout="vertical" items={formateData(detailInfo)} />
    </Card>
  );
}
