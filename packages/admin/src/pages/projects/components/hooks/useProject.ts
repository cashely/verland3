import { useState, useEffect } from 'react';
import { message } from 'antd';
import { cloneDeep } from 'lodash-es';
import { getProjectApi } from '../../api';

const DEFAULTVALUE = {
    name: '',
    webhook: '',
    open: 0
}

export default function useProject(id?: string | number, visible?: boolean ) {

    const [project, setProject] = useState(cloneDeep(DEFAULTVALUE));

    const [loading, setLoading] = useState(false);

    const getProject = async () => {
        if (!id || !visible) {
            return;
        }
        setLoading(true);
        const res = await getProjectApi<any>(id);
        if (res.code === 200) {
            setProject(res.data);
        } else {
            message.error(res.message);
        }
        setLoading(false);
    }

    const onReset = () => {
        setProject(cloneDeep(DEFAULTVALUE))
    }

    useEffect(() => {
        getProject();
    }, [visible]);

    return {
        loading,
        project,
        onReset
    };
}