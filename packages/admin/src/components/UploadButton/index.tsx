import { Button, Upload, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import { checkFileType, getBase64, isFileExceedsMaxSize } from './uploadFn';
import type { FileType } from './uploadFn';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import request from '@/apis/request';
import { produce } from 'immer';
import { resolve } from 'path';

interface UniversalUploadProps {
  action?: string; // 上传地址
  headers?: Record<string, string>; // 请求头
  maxSize?: number; // 文件最大尺寸（MB）
  maxCount?: number; // 最大上传数量
  accept?: string; // 可接受文件类型
  name?: string; // 该formItem表单的prop
  multiple?: boolean; // 是否支持多选
  onUploadSuccess?: (response: any) => void; // 上传成功回调
  onUploadError?: (error: Error) => void; // 上传失败回调
  children?: any;
}

const UploadButton: React.FC<UniversalUploadProps> = ({
  setFormLoading = () => { },
  uploadProps = {
    accept: "image/*",
    multiple: false,
    maxSize: 3, //3M
  },
  receiveFileList = [], //回显的图片
  name = '', //该formItem表单的prop
  putProp = '', //另外一个参数
  onUploadSuccess,
  onDeleteFile,
}) => {
  // const { onSuccess, children, projectId } = props;
  //是否正在上传
  const [isUploading, setIsUploading] = useState(false);
  // 弹窗是否可见
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);

  const handleBeforeUpload = (file: any, fileList: FileList[]) => {
    console.log('onBeforeUpload', file, fileList);
    // //判断文件大小
    // if (isFileExceedsMaxSize(file, uploadProps.maxSize)) {
    //   //判断文件类型
    //   if (checkFileType(file, uploadProps.accept)) {
    //     // onUpload([file]);
    //     setFileList([...fileList, file])
    //   }
    // }
    return isFileExceedsMaxSize(file, uploadProps.maxSize) && checkFileType(file, uploadProps.accept);
  };

  const handlePreview = async (file: UploadFile) => {
    console.log(file);
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
    console.log(file, 'handleChange-file');
    return;
    onUpload(file.originFileObj as File).then(url => {
      //构造图片对象
      const fileObj = {
        url,
        uid: file.uid,
        status: 'done',
        percent: 100
      }
      console.log(fileObj, 'fileObj441');
      setFileList(
        produce((draft) => {
          console.log(draft.length, 'draft441');
          if (draft.length === 1) {
            draft[0] = fileObj;
          } else {
            draft.push(fileObj);
          }
        })
      );
      //将数据传到父组件
      onUploadSuccess?.(fileObj);
    })
    console.log(newFileList, 'handleChange-newFileList441', name);
    if (name === 'thumb') {
      onUploadSuccess?.({ [putProp]: '', [name]: {} });
    }
  };

  //自定義上傳
  const onUpload = (file: File) => {
    return new Promise(async (resolve, reject) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        setFormLoading(true);
        const res: any = await request.post('/file', formData, {
          onUploadProgress(progressEvent: ProgressEvent) {
            const { total, loaded } = progressEvent;
            // const percentage = Math.ceil(loaded / total * 100);
            // this.$emit('on-progress', percentage, progressEvent);
            // progressCb(percentage);
            setIsUploading(true);
          },
        });
        if (res.code === 200) {
          const { data } = res;
          const url = import.meta.env.VITE_API_BASE_URI + '/' + data?.path;
          resolve(url)
        } else {
          reject('上传失败')
        }
      } finally {
        setIsUploading(false);
      }
    })

  };

  const handleRemove = (file: UploadFile) => {
    console.log('42+++删除文件', file)
    onDeleteFile && onDeleteFile?.(file.uid)
  }

  useEffect(() => {
    console.log('receiveFileList42', receiveFileList);
    setFileList(receiveFileList);
  }, [receiveFileList.length]);

  return (
    <>
      <Upload
        name="file"
        fileList={fileList}
        showUploadList={true}
        disabled={isUploading}
        maxCount={1}
        onPreview={name === 'fileId' ? undefined : handlePreview}
        onRemove={handleRemove}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        {...uploadProps}

      >
        <Button
          variant={name === 'thumb' ? 'link' : 'outlined'}
          color="default"
          icon={<CloudUploadOutlined />}
          title="上傳圖片"
        >
          Upload
        </Button>
      </Upload>

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
      )}
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
  );
};

export default UploadButton;
