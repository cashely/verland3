import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { SignatureOutlined } from '@ant-design/icons';
import Editor from '../../../components/editor';

interface IProps {
    templateStr?: string;
    className?: string;
    onSave: (value?: string) => Promise<void>;
}

function ProjectTemplate(props: IProps) {

    const { templateStr, className } = props;

    const [visible, setVisible] = useState(false);

    const [value, setValue] = useState<Partial<string>>();

    useEffect(() => {
        setValue(templateStr)
    }, [templateStr])


    /**
     * @name 保存
     */

    const onSave = async () => {
        try {
            await props.onSave(value);
            setVisible(false);
        } catch (error) {
            console.log(error)
        }

    }

    const onClick = (e: any) => {
        setVisible(true);
        e.stopPropagation();
    }


    return (
        <>
            <Modal
                open={visible}
                onCancel={() => { setVisible(false) }}
                onOk={onSave}
                getContainer={document.body}
            >
                <div className='w-full h-[300px] pr-10'>
                    <Editor
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </Modal>
            <div className={className}>
                <Button
                    className='text-gray-500'
                    color="default"
                    variant='text'
                    onClick={onClick}
                    icon={<SignatureOutlined />}
                >
                    {/* 模版 */}
                </Button>
            </div>
        </>
    )
}

export default ProjectTemplate;