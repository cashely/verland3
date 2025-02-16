import { Button, Upload, Modal, Collapse, message, Image } from 'antd';
import React, { useState } from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import { checkFileType, getBase64 } from './uploadFn';
import type { FileType } from './uploadFn';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { acceptFileTypes } from './uploadConfig';
import request from '@/apis/request';

interface Iprops {
  onSuccess?: (result: any) => void;
  projectId: number;
  children?: any;
}
interface UniversalUploadProps {
  action?: string; // 上传地址
  headers?: Record<string, string>; // 请求头
  maxSize?: number; // 文件最大尺寸（MB）
  maxCount?: number; // 最大上传数量
  accept?: string; // 可接受文件类型
  formProp?: string; // 该formItem表单的prop
  multiple?: boolean; // 是否支持多选
  onUploadSuccess?: (response: any) => void; // 上传成功回调
  onUploadError?: (error: Error) => void; // 上传失败回调
  children?: any;
}

const UploadButton: React.FC<UniversalUploadProps> = ({
  maxSize = 10,
  maxCount = 1,
  accept = acceptFileTypes.join(','),
  multiple = false,
  formProp = '',//该formItem表单的prop
  onUploadSuccess,
  onUploadError,
  children
}) => {

  // const { onSuccess, children, projectId } = props;
  //是否正在上传
  const [isUploading, setIsUploading] = useState(false);
  // 弹窗是否可见
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  // 上传以后返回的文档列表
  const [documents, setDocuments] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  const onBeforeUpload = (file: any) => {
    console.log('onBeforeUpload', file)
    if (checkFileType(file, { accept, maxSize })) {
      // setFileList([...fileList, file])
      onUpload([...fileList, file]);
      return;
    }
    return;
  }

  //自定義上傳
  const onUpload = async (fileList: UploadFile[]) => {
    const formData = new FormData();
    const _files = []
    fileList.forEach((file: UploadFile) => {
      formData.append('file', file);
      _files.push({
        uid: file.uid,
        name: file.name,
        percent: 0,
        status: 'uploading',
      })
    });
    try {
      const res: any = await request.post('/file', formData,
        {
          onUploadProgress(progressEvent: ProgressEvent) {
            const { total, loaded } = progressEvent;
            const percentage = Math.ceil(loaded / total * 100);
            // this.$emit('on-progress', percentage, progressEvent);
            // progressCb(percentage);
            setIsUploading(true)
          }
        }
      );
      if (res.code === 200) {
        // setVisible(true);
        // setDocuments(res.data);
        onUploadSuccess?.({
          formProp,
          data: import.meta.env.VITE_API_BASE_URI + res.data
        })
        setIsUploading(false)
      }
    } catch (error) {

    }

  }

  /**
   * @name onCollapseChange 折叠面板变化时
   * @param key 
   */
  const onCollapseChange = (keys: string[]) => {
  }

  /**
   * @name onSaveBulk 保存
   */
  const onSaveBulk = async () => {
    // const res: any = await request.post('/document/import/swagger', {
    //     projectId,
    //     documents: documents.map((item: any) => {
    //         return {
    //             path: item.path,
    //             method: item.method,
    //             content: item.content,
    //             description: item.description,
    //         }
    //     })
    // });
    // if (res.code === 200) {
    //     message.success('保存成功');
    //     setVisible(false);
    //     onSuccess && onSuccess(res);
    // }
  }

  const handlePreview = async (file: UploadFile) => {
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    console.log(file, 'handleChange-file')
    console.log(newFileList, 'handleChange-newFileList')
    // setFileList(newFileList)
  }

  return (
    <>
      <Upload
        name='file'
        listType="picture-card"
        accept={accept}
        multiple={multiple}
        fileList={fileList}
        showUploadList={true}
        disabled={isUploading}
        maxCount={maxCount}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={onBeforeUpload}
      >
        <Button variant='link' color='default' icon={<CloudUploadOutlined />} title="上傳圖片">Upload</Button>
      </Upload >

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )
      }
      {/* {children(isUploading)} */}
      {/* <Modal
                width={'80%'}
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={onSaveBulk}
            >
                <Collapse
                    items={
                        documents.map((item: any) => {
                            return {
                                key: `${item.path}_${item.method}`,
                                label: item.path,
                                children: <div className='h-[200px]'><Editor value={item.content} /></div>,
                            }
                        })
                    }
                    onChange={onCollapseChange}
                />
            </Modal> */}
    </>
  )
}

export default UploadButton;