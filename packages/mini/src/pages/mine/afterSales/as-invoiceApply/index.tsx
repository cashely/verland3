import { useState } from 'react';
import { View, Text, RadioGroup, Label, Radio } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtModal } from 'taro-ui';
import { TICKET_TYPE } from '@/constants';
import { add } from '@/apis/ticket';
import { useLoad, navigateBack, showToast } from '@tarojs/taro';
import regexObj from '@/utils/regexObj';
import { formatPrice } from '@/utils';
import './index.scss';

const textTemplate = {
  1: '申请成功，后台人员将在2个工作日以内将发票发送到您指定的邮箱，如未收到请联系客服反馈~！',
  2: '已收到您的催票申请，后台工作人员收到提醒后尽快为您处理，请耐心等待~',
  3: '请先核对您的开票信息是否填写正确，后台工作人员将会跟进您的申请，请耐心等待~',
};
export default function AsApplyInvoice() {
  const [formData, setFormData] = useState<{
    price: string | number;
    number: string | number;
    type: string;
    header: string;
    email: string;
    bookId: string;
  }>({
    number: '',
    bookId: '',
    type: '1',
    header: '',
    email: '',
    price: '',
  });
  const [isOpened, setIsOpened] = useState(false);
  const [status, setStatus] = useState(0);

  useLoad((option) => {
    const { totalAmount, id } = option;
    setFormData({
      ...formData,
      bookId: id,
      price: formatPrice(totalAmount),
    });
  });

  const handleSubmit = () => {
    if (formData?.type == 2 && (!formData.header || !formData.number)) {
      showToast({
        title: '请填写发票抬头和企业税号',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!regexObj.email.test(formData.email)) {
      showToast({
        title: '请输入正确的邮箱',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    add({
      ...formData,
      type: Number(formData.type),
    }).then((res) => {
      if (res.code === 200) {
        setStatus(1);
        if (!isOpened) setIsOpened(true);
      }
    });
  };
  const handleClose = () => {
    setIsOpened(false);
    navigateBack();
  };
  const handleConfirm = () => {
    setIsOpened(false);
  };
  const handleRadioChange = (e) => {
    const { value } = e.detail;
    setFormData({
      ...formData,
      type: value,
    });
  };
  const handleInputChange = (value, name) => {
    setFormData((d) => {
      return {
        ...d,
        [name]: value,
      };
    });
  };
  return (
    <View className="page-invoiceApply">
      <AtInput
        name="value"
        title="开票金额"
        type="text"
        // required
        disabled
        placeholder="请填写"
        value={formData.price + '元'}
      />
      {/* <AtInput
          name="value"
          title="开票类型"
          type="number"
          placeholder="请选择开票类型"
          value={formData.type}
        /> */}
      <View className="flex items-center justify-between customItem">
        <View className="label">
          <Text>开票类型</Text>
        </View>
        <RadioGroup className="radioGroup" onChange={handleRadioChange}>
          {TICKET_TYPE?.map((item, index) => (
            <Label className="radioItem" key={index}>
              <Radio value={item.value} checked={formData.type === item.value}>
                {item.label}
              </Radio>
            </Label>
          ))}
        </RadioGroup>
      </View>
      {formData.type === '2' && (
        <AtInput
          name="header"
          title="发票抬头"
          type="text"
          placeholder="请填写（个人不需）"
          cursor={1000}
          value={formData.header}
          onChange={(e) => handleInputChange(e, 'header')}
        />
      )}
      {formData.type === '2' && (
        <AtInput
          name="number"
          title="企业税号"
          cursor={1000}
          type="text"
          onChange={(e) => handleInputChange(e, 'number')}
          placeholder="请填写"
          value={formData.number}
        />
      )}
      <AtInput
        name="email"
        title="邮箱"
        type="text"
        cursor={1000}
        placeholder="请填写"
        onChange={(e) => handleInputChange(e, 'email')}
        value={formData.email}
      />
      <AtButton circle type="primary" className="subBtn" onClick={handleSubmit}>
        提交
      </AtButton>

      <AtModal
        isOpened={isOpened}
        cancelText="我已知晓"
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleClose}
        content={textTemplate[status]}
      ></AtModal>
    </View>
  );
}
