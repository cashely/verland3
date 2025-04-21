import { AtActionSheet, AtButton } from 'taro-ui';
import { View } from '@tarojs/components';
import './index.scss';
export default function Index(props: any) {
  const handleOnCancel = () => {
    props?.onClose?.();
  };
  const handleClose = () => {
    props?.onClose?.();
  };

  const handleClick = () => {
    props.onConfirm && props?.onConfirm(true);
  };
  return (
    <AtActionSheet
      isOpened={props.isOpened}
      title={props.title}
      onCancel={handleOnCancel}
      onClose={handleClose}
    >
      <View className="content">
        宠物善终服务协议
        <View>甲方（宠物主人）：姓名：__________________</View>
        <View>身份证号码：______________</View>
        <View>联系电话：________________</View>
        <View> 乙方（宠物善终服务提供方）：</View>
        <View> 公司名称：广州振德翊兆生物科技有限公司（品牌：“它念”）</View>
        <View>公司地址：广州市海珠区仑头路78号之三A01栋108号房</View>
        <View>联系电话：19120038398</View>
        鉴于甲方拥有宠物，现因宠物死亡，甲方需要对宠物进行妥善处理。乙方作为专业的宠物善终服务提供方，愿意为甲方提供宠物善终服务。双方本着平等自愿、诚实信用的原则，经协商一致，订立本合同，以资共同遵守。
        <View>
          <View className="title">
            第一条 服务内容 乙方根据甲方要求，提供如下宠物善终服务：
          </View>
          <View>
            1.遗体接收与登记：乙方为甲方提供宠物遗体接收、运输、登记、冷藏等服务。
          </View>
          <View>
            2.处理方式：根据甲方要求，提供以下其中一种服务：
            <View>a、单独火化</View>
            <View>b、集体火化</View>
          </View>
          <View>3.告别仪式：提供告别仪式服务，包括场地布置、视频记录等。</View>
          <View>4.其他服务：如有特殊要求，双方另行协商。</View>
        </View>
        <View className="title">第二条 服务费用</View>
        <View>
          1.费用标准：甲方同意根据乙方提供的服务项目支付相应费用，具体费用以乙方对外公示“费用标准”为准。
        </View>
        <View>
          2.费用支付：甲方需在确定服务内容签订合同后、享受服务前支付相应服务费用到乙方指定账户。
        </View>
        <View className="title">第三条 服务流程</View>
        <View>
          1.遗体接收：乙方将按照约定时间与地点接收甲方宠物遗体，进行消毒、清洁，并为遗体做好妥善存放。
        </View>
        <View>2.处理：乙方根据甲方要求，完成火化或其他服务内容。</View>
        <View>
          3.遗留物交付及放弃处置：乙方将在处理完成后，将宠物遗留物及其他纪念品交付给甲方。如甲方选择放弃对遗留物的处置，遗留物处理权归乙方所有。
        </View>
        <View className="title">第四条 双方责任及义务 1.甲方责任及义务：</View>
        <View>a. 甲方有权要求乙方按照合同约定提供服务。</View>
        <View>b.甲方应提供真实、准确的宠物信息及相关证明文件。</View>
        <View>c. 甲方应按时支付费用给乙方。</View>
        <View>d.乙方应保护甲方个人信息和宠物信息，严禁泄露客户信息。</View>
        <View className="title">2.乙方责任及义务：</View>
        <View className="title">a. 乙方有权按照合同约定收取服务费用。</View>
        <View className="title">
          b.乙方应按照合同约定提供服务保证服务质量，并确保处理过程符合环保和卫生要求。
        </View>
        <View className="title">第五条 合同的变更与解除</View>
        <View>
          1.若甲方在服务过程中需要变更服务内容或取消服务，应提前一日通知乙方。
        </View>
        <View>2.若乙方无法按时提供服务，应及时与甲方沟通并协商补救措施。</View>
        <View>
          3.因甲方个人原因要求中止服务，乙方已提供服务的费用不予退还。
        </View>
        <View className="title">第六条 免责条款</View>
        <View>1.乙方对于不可抗力因素导致的服务延迟或无法完成不承担责任。</View>
        <View>
          2.甲方应知悉并接受宠物善终过程中可能存在的情感影响，并理解相关服务性质。由此产生的甲方损失，乙方不承担责任。
        </View>
        <View className="title">第七条 争议解决</View>
        <View>
          如双方在合同履行过程中发生争议，应友好协商解决。如协商无果，任何一方可向乙方所在地法院提起诉讼。
        </View>
        <View className="title">
          第八条 合同生效 本协议自双方签字之日起生效。
        </View>
        甲方（宠物主人）签字： ___________________
        <View>乙方（服务提供方）签字： 广州振德翊兆生物科技有限公司</View>
        签订日期： ___________________
        <AtButton circle className="mt-30" type="primary" onClick={handleClick}>
          我已知晓
        </AtButton>
      </View>
    </AtActionSheet>
  );
}
