import { Empty } from 'antd';
import CreateProjectButton from "./CreateProjectButton";

interface Iprops {
    onOk?: () => void;
}

function ProjectEmpty(props: Iprops) {

    const { onOk } = props;

    return (
        <div className='h-full w-full flex items-center justify-center'>
            <Empty
                description={false}
            >
                <CreateProjectButton onOk={onOk} />
            </Empty>
        </div>
    )
}

export default ProjectEmpty;
