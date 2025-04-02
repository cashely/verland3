import { acceptFileTypes } from './uploadConfig'
import { message, Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

//判断上传文件大小是否超过限制 默认3M
const isFileExceedsMaxSize = (file: UploadFile, maxSize: number = 3) => {
    if (!file) return message.error('文件不存在');
    const MAX_SIZE = 1024 * 1024 * maxSize;  //转为b
    if (file.size! < MAX_SIZE || file.size === maxSize) {
        return true;
    } else {
        message.error(`文件大小不能超过 ${maxSize}MB`);
        throw new Error('The file size exceeds the limit!')
    }
}
const checkFileType = (file: File, accept = "") => {
    if (!file) return message.error('文件不存在');
    //文件類型校驗
    if (!!accept) {
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
    }
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


export {
    checkFileType, getBase64,
    isFileExceedsMaxSize
}
export type {
    FileType
}