import { Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CodeLight from "../../../components/codeLight";

type TProps = {
    projectAlias?: string;
}

function ProjectTip(props: TProps) {
    const { projectAlias } = props;
    const code =
`前端项目可以在vite或者webpack的proxy中配置一下前缀地址
${import.meta.env.VITE_API_BASE_URI}/${projectAlias}
即可把所有访问都转发到mock服务上面，不影响生产环境
`
    return (
        <Popover
            content={
                <pre>
                    {code}
                </pre>
            }
        >
            <span className='text-gray-500 hover:text-gray-600 cursor'>
                <QuestionCircleOutlined />
            </span>
        </Popover>
    )
}

export default ProjectTip;