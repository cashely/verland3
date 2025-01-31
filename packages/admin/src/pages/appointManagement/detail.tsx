
import loadable from "@loadable/component";
const DetailTemplate = loadable(() => import("../../components/DetalTemplate"))
import type { DescriptionsProps } from 'antd';
export default () => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '姓名',
            children: 'Zhou Maomao',
        },
        {
            key: '2',
            label: '年龄',
            children: '1810000000',
        },
        {
            key: '3',
            label: '住址',
            children: 'Hangzhou, Zhejiang',
        },
        {
            key: '4',
            label: 'A',
            children: 'empty',
        },
        {
            key: '5',
            label: 'B',
            children: '1',
        },
    ];
    return (
        <DetailTemplate items={items}></DetailTemplate>
    )
}