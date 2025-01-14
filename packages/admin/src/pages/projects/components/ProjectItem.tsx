import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message, Divider } from 'antd';
import cs from 'classnames';
import { DeleteOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AiOutlineUnlock, AiOutlineLock } from 'react-icons/ai';
import useTheme from '../../../hooks/themeContext';
import UploadButton from '../../../components/common/UploadButton';
import CreateProjectButton from './CreateProjectButton';
import ProjectTemplate from './ProjectTemplate';
import { deleteProjectApi, updateProjectApi } from '../api';
import { formatDate } from '../../../utils';
import React, { useState } from 'react';
import ProjectTip from './ProjectTip';

interface IProps {
    project: Record<string, any>;
    onOk?: () => void;
}

function ProjectItem(props: IProps) {
    const { project } = props;

    const { theme } = useTheme();

    const [hover, setHover] = useState(false);

    const navigate = useNavigate();

    const onHandleProjectClick = (item: any) => {
        navigate(`/project/${item.id}`)
    }

    const onHandleProjectDelete = async (item: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const res: any = await deleteProjectApi(item.id);
        if (res.code === 200) {
            message.success('操作成功');
            props.onOk && props.onOk();
        }
    }

    const onSaveProjectTemplate = async (id: number, data: Record<string, any>) => {
        const res: any = await updateProjectApi(id, data);
        
        if (res.code === 200) {
            message.success('操作成功');
            props.onOk && props.onOk();
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    }

    return (
        <div className={`border rounded ${cs({'border': hover})}`} style={{ borderColor: hover ? theme.hover : undefined }} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <h2 className='border-b p-2 flex justify-between'>
                {project.name}
                <div className='flex items-center'>
                    <Space size='small'>
                        <ProjectTip
                            projectAlias={project.alias}
                        />
                        <span className='text-gray-500'>
                            {
                                project.open === 1
                                ?
                                <AiOutlineUnlock />
                                :
                                <AiOutlineLock />
                            }
                        </span>
                    </Space>
                </div>
            </h2>
            <ul className='p-2 text-sm text-gray-400'>
                <li>
                    <span>文档数量:</span>
                    <span>{project.count}</span>
                </li>
                <li>
                    <span>创建人:</span>
                    <span className='ml-2'>{project.creator.username}</span>
                </li>
                <li>
                    <span>创建时间:</span>
                    <span className='ml-2'>{formatDate(project.createdAt)('YYYY-MM-DD')}</span>
                </li>
            </ul>
            <div className="border-t px-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                <ProjectTemplate
                    templateStr={project.template}
                    onSave={(template) => onSaveProjectTemplate(project.id, { template })}
                />
                <Divider type='vertical' />
                <CreateProjectButton id={project.id} title="编辑项目" onOk={props.onOk}>
                    {
                        (setVisible) => {
                            return (
                                <Button
                                    className='text-gray-500'
                                    icon={<SettingOutlined /> }
                                    variant='text'
                                    color='default'
                                    onClick={() => setVisible(true)}
                                />
                            )
                        }
                    }
                </CreateProjectButton>
                <Divider type='vertical' />
                <UploadButton
                    projectId={project.id}
                    onSuccess={() => props.onOk && props.onOk()}
                />
                <Divider type='vertical' />
                <Button title="删除" icon={<DeleteOutlined/>} variant='link' color='danger' onClick={(e) => onHandleProjectDelete(project, e)} />
                <Divider type='vertical' />
                <Button color="primary" variant='link' className='text-sm' onClick={() => onHandleProjectClick(project)}>进入项目</Button>
            </div>
        </div>
    )
}

export default ProjectItem;