import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { detail } from '@/apis/advise';
import { formatDateTime } from '@/utils';
import waitDeal from '../../../../../subpackages/assets/images/wait_deal.png';
import './index.scss';

interface IProps {
  id: string;
  createdAt: string | Date;
  replayContent: string;
  content: string;
}

export default function Detail() {
  useLoad((option) => {
    option?.id &&
      detail(option?.id).then((res) => {
        if (res?.data) {
          setData(res.data);
        }
      });
  });
  const [data, setData] = useState<IProps>();

  return (
    <View className="page-detail">
      <View className="header">
        <Image src={waitDeal} mode="widthFix" className="icon"></Image>
        <View>{data?.replayContent ? '已处理' : '待处理'}</View>
      </View>
      <View className="advice-item">
        <View className="sub-item">
          <Text className="tag">投诉时间</Text>
          <Text className="val">{formatDateTime(data?.createdAt!)} </Text>
        </View>
        <View className="sub-item">
          <Text className="tag">投诉内容</Text>
          <Text className="val">{data?.content || '-'}</Text>
        </View>
        <View className="sub-item">
          <Text className="tag">平台反馈</Text>
          <Text className="val">{data?.replayContent || '暂无反馈'}</Text>
        </View>
      </View>
    </View>
  );
}
