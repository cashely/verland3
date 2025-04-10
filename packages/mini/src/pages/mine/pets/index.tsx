import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { navigateTo, useDidShow } from '@tarojs/taro';
import { AtAvatar, AtButton } from 'taro-ui';
import { list } from '@/apis/pet';
import { DEFAULT_IMAGE } from '@/constants';
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
    if (!path) return DEFAULT_IMAGE;
    return fileUrl + '/' + path;
  };
  return (
    <View className="page-pets">
      {pets.map((item, index) => (
        <View className="pet-item" key={index}>
          <AtAvatar
            className="avatar"
            image={showImage(item?.petImage?.[0]?.image?.path)}
            circle
          ></AtAvatar>
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
      <View className="footer">
        <AtButton className="addBtn" onClick={handleAddPet} type="primary">
          添加
        </AtButton>
      </View>
    </View>
  );
}
