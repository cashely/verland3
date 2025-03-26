import { useEffect, useState } from 'react';
import { View, Picker, Image } from '@tarojs/components';
import {
  useLoad,
  navigateBack,
  getStorageSync,
  setStorageSync,
  showToast,
  uploadFile,
  chooseImage,
} from '@tarojs/taro';
import { AtAvatar, AtButton, AtInput } from 'taro-ui';
import { baseUrl } from '@/apis';
import { GENDER } from '@/constants';
import editIcon from '../../../assets/imgs/edit.png';
import { putUser } from '@/apis/user';
import './index.scss';

export default function Profile() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  const [formData, setFormData] = useState<any>({
    avatar: '',
    username: '',
    phone: '',
    gender: '',
  });

  const handleCancel = () => {
    navigateBack();
  };
  const handleSave = () => {
    putUser({
      ...formData,
      gender: +formData.gender,
    }).then((res) => {
      console.log(res);
      if (res?.code === 200) {
        // 保存成功
        const _storage = getStorageSync('userInfo');
        setStorageSync('userInfo', {
          ..._storage,
          ...{
            ...formData,
            nickname: formData.nickname,
          },
        });
        setFormData({
          ..._storage,
          ...formData,
        });
        showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000,
        });
      }
    });
  };

  const handleChange = (val, key) => {
    if (key === 'gender') {
      console.log(val.detail.value);
      setFormData({
        ...formData,
        [key]: val.detail.value,
        genderDesc: GENDER[val.detail.value],
      });
      return;
    }
    setFormData({
      ...formData,
      [key]: val,
    });
  };

  const handleChoseAvatar = () => {
    chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持
    }).then((res) => {
      console.log(res, 'album');
      if (!res.tempFilePaths?.length) return;
      const filePath = res.tempFilePaths[0];
      uploadFile({
        url: `${baseUrl}/file`,
        name: 'file',
        filePath,
        success: (res) => {
          if (res?.statusCode == 200) {
            const { data = {} } = res?.data ? JSON.parse(res.data) : {};
            console.log(data);
            setFormData({
              ...formData,
              avatar: baseUrl + '/' + data?.path,
              imageIds: [data?.id],
            });
          }
        },
        fail: () => {
          showToast({
            title: '上传失败',
            icon: 'none',
          });
        },
      });
    });
  };

  useEffect(() => {
    const userInfo = getStorageSync('userInfo');
    if (userInfo) {
      setFormData({
        ...formData,
        username: userInfo.username,
        phone: userInfo.phone,
        avatar: userInfo.avatar,
        gender: userInfo.gender,
        genderDesc: GENDER[userInfo.gender],
      });
    }
  }, []);

  return (
    <View className="page-profile">
      <View className="form-box">
        <View className="header" onClick={handleChoseAvatar}>
          <AtAvatar
            image={formData.avatar}
            circle
            className="avatar"
            size="large"
          />
          <View className="edit-box">
            <Image src={editIcon} mode="widthFix" className="edit-icon"></Image>
          </View>
        </View>
        <View className="header-title">家长姓名</View>
        <AtInput
          name="username"
          title="名字"
          type="text"
          placeholder="请输入您的名字"
          value={formData['username']}
          onChange={(e) => handleChange(e, 'username')}
          onClick={() => console.log('click')}
        />
        <AtInput
          name="phone"
          title="联系电话"
          type="phone"
          placeholder="请输入电话号码"
          value={formData['phone']}
          onChange={(e) => handleChange(e, 'phone')}
        />

        <Picker
          range={GENDER}
          mode="selector"
          onChange={(e) => handleChange(e, 'gender')}
          value={formData['gender']}
        >
          <AtInput
            name="gender"
            title="性别"
            placeholder="请选择您的性别"
            value={formData['genderDesc']}
          />
        </Picker>

        <View className="pl-20 pr-20 btn-box">
          <AtButton
            type="primary"
            className="cancel btn"
            onClick={handleCancel}
          >
            取消
          </AtButton>
          <AtButton type="primary" className="btn" onClick={handleSave}>
            保存
          </AtButton>
        </View>
      </View>

      {/* <View className="header mt-30 mb-30" onClick={handleGetUserInfo}>
        <AtAvatar
          image={userInfo.avatarUrl || 'https://img.yzcdn.cn/vant/cat.jpeg'}
          circle
          className="avatar mb-30"
          size="large"
        />
        <View className="mt-20">{userInfo.nickName || '未登录'}</View>
      </View>
      {userInfo.nickName && (
        <AtList>
          <AtListItem title="手机号"></AtListItem>
          <AtListItem
            title="性别"
            extraText={userInfo.gender === 1 ? '男' : '女'}
          ></AtListItem>
        </AtList>
      )} */}
    </View>
  );
}
