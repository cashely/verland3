import { createFromIconfontCN } from '@ant-design/icons';


const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/c/font_4819930_obe08jogf6s.js',
    ],
    extraCommonProps: {
        prefix: 'cwl'
    }
});

export default (props: any) => {
    return <IconFont style={{
        fontSize: '16px',
        color: '#1890ff',
        // color: "red",//'#1890ff'
        cursor: 'pointer'
    }} {...props} />
};