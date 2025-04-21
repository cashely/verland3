import { View } from '@tarojs/components';
import { useState } from 'react';
import { AtInput } from 'taro-ui';
import './index.scss';
import { useLoad } from '@tarojs/taro';
import { detail } from '@/apis/ticket';
import { formatPrice } from '@/utils';
interface IProps {
  number: string;
  header: string;
  email: string;
  payAmount: string;
  type: 1 | 2;
}

export default () => {
  const [formData, setFormData] = useState<IProps>();
  useLoad((option) => {
    option?.id && getData(option);
  });

  const getData = async (option) => {
    const res = await detail(option.id);
    if (res.code === 200) {
      setFormData({
        ...res.data,
        totalAmount: formatPrice(option.totalAmount),
      });
    }
  };
  return (
    <View className="page-invoice-detail">
      <View className="item">
        <View className="text-center title">发票信息</View>
        <AtInput
          name="value"
          title="开票金额"
          type="text"
          value={formData?.totalAmount}
        />
        <AtInput
          name="value"
          title="开票类型"
          type="text"
          value={formData?.type === 1 ? '个人' : '企业'}
        />
        {formData?.type === 2 && (
          <>
            <AtInput
              name="value"
              title="开票抬头"
              type="text"
              value={formData?.header || '-'}
            />
            <AtInput
              name="value"
              title="企业税号"
              type="text"
              value={formData?.number || '-'}
            />
          </>
        )}
        <AtInput
          name="value"
          title="邮箱"
          type="text"
          value={formData?.email || '-'}
        />
      </View>
    </View>
  );
};
