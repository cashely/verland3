import { useState } from 'react';
import { View, Image, Picker } from '@tarojs/components';
import { showToast, uploadFile, navigateBack } from '@tarojs/taro';
import { AtInput, AtButton, AtImagePicker, AtModal } from 'taro-ui';
import { add } from '@/apis/pet';
import petBg from '../../../../subpackages/assets/images/bg.png';
import { baseUrl } from '@/apis';
import { PET_TYPES } from '@/constants';
import './index.scss';

interface IFileItem {
  url: string;
  [key: string]: string;
}

export default function Add() {
  const [formData, setFormData] = useState({
    petname: '',
    type: '',
    subType: '',
    petType: '',
    weight: '',
    age: '',
    imageIds: [],
    statu: 1, //0死亡 1活着
  });

  const [files, setFiles] = useState<IFileItem[]>([]);
  const [isOpened, setIsOpened] = useState(false);

  const handleAdd = () => {
    add({
      ...formData,
      petType: undefined,
      weight: Number(formData.weight),
    }).then((res) => {
      if (res.code === 200) {
        showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000,
          success: () => {},
        }).then(() => {
          setTimeout(() => {
            navigateBack();
          }, 1000);
        });
      }
    });
  };

  const formConfig = [
    {
      title: '爱宠昵称',
      key: 'petname',
      type: 'text',
      placeholder: '请输入',
    },
    {
      title: '宠物类型',
      key: 'petType',
      type: 'multiSelector',
      placeholder: '请选择爱宠类型',
    },
    {
      title: '体重',
      key: 'weight',
      type: 'number',
      placeholder: '请输入',
    },
    {
      title: '年龄',
      key: 'age',
      type: 'number',
      placeholder: '请输入',
    },
    // {
    //   title: '宠物照片',
    //   key: 'image',
    //   type: 'upload',
    //   editable: false,
    //   placeholder: '请上传',
    // },
  ];

  const handleChange = (value: any, key: string) => {
    if (key === 'petType') {
      const type = PET_TYPES[0][value.detail.value[0]];
      const subType = PET_TYPES[1][value.detail.value[1]];
      setFormData({
        ...formData,
        petType: `${type}/${subType}`,
        type,
        subType,
      });
      return;
    }
    setFormData({
      ...formData,
      [key]: value,
    });
  };
  const handleUpload = (_files: IFileItem[], type: string) => {
    console.log(files);
    if (type === 'remove') return setFiles([]);
    if (files.length == 1)
      return showToast({ title: '最多上传一张照片', icon: 'none' });
    // console.log(file);
    uploadFile({
      url: `${baseUrl}/file`,
      name: 'file',
      filePath: _files[0].url,
      success: (res) => {
        if (res?.statusCode == 200) {
          const { data = {} } = res?.data ? JSON.parse(res.data) : {};
          console.log(data);
          setFormData({
            ...formData,
            imageIds: [data?.id],
          });
          setFiles([
            {
              url: baseUrl + '/' + data?.path,
              name: 'petThumb',
            },
          ]);
        }
      },
      fail: () => {
        setFiles([
          {
            url: _files[0].url,
            name: 'petThumb',
          },
        ]);
      },
    });
  };
  const handleImageClick = () => {
    setIsOpened(true);
  };

  return (
    <View className="page-petAdd">
      <Image
        src={petBg}
        mode="widthFix"
        style={{
          width: '100%',
        }}
      ></Image>
      <View className="form-box">
        {formConfig.map((item, index) =>
          item.type !== 'multiSelector' ? (
            <AtInput
              name={item.key}
              title={item.title}
              type={item.type}
              cursor={1000}
              placeholder={item.placeholder}
              value={formData[item.key]}
              onChange={(e) => handleChange(e, item.key)}
              onClick={() => console.log('click')}
            />
          ) : (
            <Picker
              range={PET_TYPES}
              mode="multiSelector"
              onChange={(e) => handleChange(e, item.key)}
              value={formData[item.key]}
              key={index}
            >
              <AtInput
                name={item.key}
                title={item.title}
                placeholder={item.placeholder}
                value={formData[item.key]}
                editable={false}
              />
            </Picker>
          )
        )}
        <View className="label">爱宠照片</View>
        <AtImagePicker
          count={1}
          multiple={false}
          length={2}
          mode="scaleToFill"
          files={files}
          onImageClick={handleImageClick}
          onChange={handleUpload}
        ></AtImagePicker>

        <View className="pl-20 pr-20 btn-box">
          <AtButton type="primary" className="btn" onClick={handleAdd}>
            添加
          </AtButton>
        </View>
      </View>

      <AtModal
        isOpened={isOpened}
        confirmText="关闭"
        onClose={() => setIsOpened(false)}
      >
        <Image
          src={files[0]?.url}
          mode="widthFix"
          style={{
            width: '100%',
          }}
        ></Image>
      </AtModal>
    </View>
  );
}
