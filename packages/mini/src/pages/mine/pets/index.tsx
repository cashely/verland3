import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { navigateTo, useDidShow } from '@tarojs/taro';
import { AtAvatar, AtButton } from 'taro-ui';
import { list } from '@/apis/pet';
import petBg from '../../../subpackages/assets/images/bg.png';
import { fileUrl } from '@/apis';
import './index.scss';

export default function Pets() {
  const [pets, setPets] = useState([]);
  useDidShow(() => {
    getlist();
  });

  const getlist = () => {
    list().then((res) => {
      const { data = [] } = res;
      if (data) {
        setPets(data);
      }
    });
  };
  const handleAddPet = () => {
    navigateTo({ url: '/pages/mine/pets/add/index' });
  };

  const showImage = (path: string) => {
    if (!path)
      return 'data:image/png;base64,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';
    return fileUrl + '/' + path;
  };
  return (
    <View className="page-pets">
      <Image
        src={petBg}
        mode="aspectFill"
        style={{
          width: '100%',
        }}
      ></Image>
      <View className="content">
        {pets.map((item, index) => (
          <View className="pet-item" key={index}>
            <Image
              className="avatar"
              src={showImage(item?.petImage?.[0]?.image?.path)}
            ></Image>
            <View className="flex justify-between info">
              <Text className="font-bold name">{item.petname}</Text>
              <View>
                {item.age && <Text className="age">{item.age}个月</Text>}
                {item.weight && (
                  <Text className="ml-2 age">{item.weight || '-'}kg</Text>
                )}
              </View>
            </View>
          </View>
        ))}
        <View
          className="footer"
          style={{
            paddingTop: pets.length ? '80rpx' : '420rpx',
          }}
        >
          <AtButton className="addBtn" onClick={handleAddPet} type="primary">
            添加
          </AtButton>
        </View>
      </View>
    </View>
  );
}
