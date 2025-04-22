import { View } from '@tarojs/components';
import { showToast, navigateBack } from '@tarojs/taro';
import { AtTextarea, AtButton } from 'taro-ui';
import './index.scss';
import { useState } from 'react';
import { add } from '@/apis/advise';

export default function Create() {
  const [content, setContent] = useState<string>('');
  const handleSubmit = () => {
    if (!content.trim())
      return showToast({
        title: '内容不为空!',
        icon: 'none',
      });

    add({
      content,
      type: 2,
    }).then(() => {
      showToast({
        title: '提交成功!',
        icon: 'none',
        success() {
          setTimeout(() => {
            navigateBack();
          }, 1000);
        },
      });
    });
  };
  return (
    <View className="page-complain-create">
      <View className="mb-20 title">投诉建议</View>
      <AtTextarea
        className="cls-textarea"
        value={content}
        onChange={setContent}
        maxLength={300}
        placeholder="请输入您的建议"
      />
      <View className="px-40px mt-80px">
        <AtButton className="btn" circle onClick={handleSubmit}>
          提交
        </AtButton>
      </View>
    </View>
  );
}
