import { Button, Upload, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloudUploadOutlined } from '@ant-design/icons';
import { checkFileType, getBase64 } from './uploadFn';
import type { FileType } from './uploadFn';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { acceptFileTypes } from './uploadConfig';
import request from '@/apis/request';
import { produce } from 'immer';

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
  name?: string; // 该formItem表单的prop
  multiple?: boolean; // 是否支持多选
  onUploadSuccess?: (response: any) => void; // 上传成功回调
  onUploadError?: (error: Error) => void; // 上传失败回调
  children?: any;
}

const UploadButton: React.FC<UniversalUploadProps> = ({
  maxSize = 10,
  setFormLoading = () => {},
  accept = acceptFileTypes.join(','),
  multiple = false,
  _fileList = [],
  name = '', //该formItem表单的prop
  onUploadSuccess,
  onUploadError,
  children,
}) => {
  // const { onSuccess, children, projectId } = props;
  //是否正在上传
  const [isUploading, setIsUploading] = useState(false);
  // 弹窗是否可见
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);

  const onBeforeUpload = (file: any) => {
    console.log('onBeforeUpload', file);
    if (checkFileType(file, { maxSize })) {
      // setFileList([...fileList, file])
      // onUpload([file]);
      return;
    }
  };

  /**
   * @name onCollapseChange 折叠面板变化时
   * @param key
   */
  const onCollapseChange = (keys: string[]) => {};

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
    if (file.status === 'uploading') {
      setIsUploading(true);
      //去上传
      const _fileObj = {
        uid: file.uid,
        name: file.name,
        status: 'uploading',
        url: '',
      };
      onUpload(_fileObj, file.originFileObj as File);
      return;
    }
    console.log(newFileList, 'handleChange-newFileList');
    // setFileList(newFileList)
  };

  //自定義上傳
  const onUpload = async (fileObj, file: File) => {
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
        console.log(res, '接口调用成功');
        const url = import.meta.env.VITE_API_BASE_URI + '/' + data?.path;
        //构造图片对象
        fileObj.url = url;
        fileObj.status = 'done';
        fileObj.percent = 100;
        setFileList(
          produce((draft) => {
            if (draft.length === 1) {
              draft[0] = fileObj;
            } else {
              draft.push(fileObj);
            }
          })
        );
        onUploadSuccess?.({
          ...fileObj,
          id: data?.id,
        });
        setIsUploading(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log(fileList, _fileList);
    setFileList([...fileList, ..._fileList]);
  }, []);

  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        accept="image/*"
        multiple={false}
        fileList={fileList}
        showUploadList={true}
        disabled={isUploading}
        maxCount={1}
        onPreview={handlePreview}
        onChange={handleChange}
        // beforeUpload={onBeforeUpload}
      >
        <Button
          variant="link"
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
