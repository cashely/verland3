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
    if (!path)
      return 'data:image/png;base64,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';
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
