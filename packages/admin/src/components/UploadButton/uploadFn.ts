import { acceptFileTypes } from './uploadConfig'
import { message, Upload } from 'antd'
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const checkFileType = (file: File, {
    accept = '',
    maxSize = 10
}) => {
    if (!file) return;
    // 文件大小校验
    const isSizeValid = file.size / 1024 / 1024 <= maxSize;
    if (!isSizeValid) {
        message.error(`文件大小不能超过 ${maxSize}MB`);
        return Upload.LIST_IGNORE;
    }
    //文件類型校驗
    const fileType = file.type || '';
    const acceptTypes = accept.split(',').map(t => t.trim());
    if (accept !== '*' && !acceptTypes.some(type => {
        if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return fileType.includes(type.replace('*', ''));
    })) {
        message.error(`仅支持 ${accept} 格式文件`);
        return Upload.LIST_IGNORE;
    }
    return true;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


export {
    checkFileType, getBase64
}
export type {
    FileType
}