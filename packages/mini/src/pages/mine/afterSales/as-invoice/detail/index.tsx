import { View, RadioGroup, Radio, Label, Text } from '@tarojs/components';
import { useState } from 'react';
import { AtInput } from 'taro-ui';
import './index.scss';
import { useLoad } from '@tarojs/taro';
import { detail } from '@/apis/ticket';
import { formatPrice } from '@/utils';
import { TICKET_TYPE } from '@/constants';
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
        <View className="lineBox">
          <View className="line"></View>
        </View>
        <View className="content">
          {formData?.totalAmount && (
            <AtInput
              name="value"
              title="开票金额"
              type="text"
              editable={false}
              value={formData?.totalAmount + '元'}
            />
          )}
          <View className="flex items-center justify-between customItem">
            {/* <AtInput
              name="value"
              title="开票类型"
              type="text"
              editable={false}
              // value={formData?.type === 1 ? '个人' : '企业'}
            /> */}
            <View className="label">
              <Text>开票类型</Text>
            </View>
            <RadioGroup className="radioGroup">
              {TICKET_TYPE.map((item) => (
                <Label className="radioItem">
                  <Radio
                    color="#FF6600"
                    checked={formData?.type == item.value}
                    value={String(formData?.type)}
                    disabled={true}
                  ></Radio>
                  <View>{item.label}</View>
                </Label>
              ))}
            </RadioGroup>
          </View>
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
    </View>
  );
};
