import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { navigateTo, useDidShow } from '@tarojs/taro';
import { AtAvatar, AtButton } from 'taro-ui';
import { list } from '@/apis/pet';
import petImage from '@/assets/imgs/pet-avatar.png';
import './index.scss';

export default function Pets() {
  const [pets, setPets] = useState([
    {
      age: '',
      petname: '',
    },
  ]);
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
  return (
    <View className="page-pets">
      {pets.map((item, index) => (
        <View className="pet-item" key={index}>
          <AtAvatar className="avatar" image={petImage} circle></AtAvatar>
          <View className="flex justify-between info">
            <Text className="font-bold name">{item.petname}</Text>
            <Text className="age">{item.age}</Text>
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
