import { Button } from 'antd';
import { getDocumentApi } from '../api';
import { exportDocument } from '../../../../utils';

interface IProps {
    id: number | string
}


function ExportDocument(props: IProps) {
    const { id } = props;

    const onClick = async () => {
        const res: any = await getDocumentApi(id);
        if (res.code === 200) {
            console.log(res.data)
            exportDocument(res.data);
        }
    }

    return (
        <Button
            onClick={onClick}
        >导出</Button>
    )
}

export default ExportDocument;