import { createFromIconfontCN } from '@ant-design/icons';


const PetIcon = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/c/font_4819930_obe08jogf6s.js',
    ],
    extraCommonProps: {
        prefix: 'cwl'
    }
});

export default (props: any) => {
    return <PetIcon  {...props} style={{
        fontSize: 16,
        // color: '#1890ff',
        // color: "red",//'#1890ff'
        cursor: 'pointer'
    }} />
};