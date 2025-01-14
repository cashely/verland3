import { PlusOutlined } from '@ant-design/icons'
import CreateProjectButton from "./CreateProjectButton";
import ProjectEmpty from "./ProjectEmpty";
import ProjectItem from "./ProjectItem";

interface IProps {
  data: any[];
  onOk?: () => void;
}

function ProjectList(props: IProps) {
  const { data, onOk } = props;

  return (
    <div className="p-2 w-full">
      {
        data.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 2xl:grid-cols-7">
            {
              data.map((project) => (
                <ProjectItem
                  project={project}
                  key={project.id}
                  onOk={onOk}
                />
              ))
            }
            <CreateProjectButton
              onOk={onOk}
            >
              {
                (setVisible) => {
                  return (
                    <div
                      onClick={() => setVisible(true)}
                      className='rounded border bg-white h-full p-2 min-w-[150px] flex items-center justify-center cursor-pointer flex-col hover:border-gray-300'
                    >
                      <PlusOutlined className='text-gray-400 text-[26px]' />
                      <span className='text-sm mt-2 text-gray-500'>创建项目</span>
                    </div>
                  )
                }
              }
            </CreateProjectButton>
          </div>
        ) : (
          <ProjectEmpty onOk={onOk} />
        )
      }
    </div>
  );
}

export default ProjectList;