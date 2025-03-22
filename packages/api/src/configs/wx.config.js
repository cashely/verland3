/**
 * 微信需要的配置文件
 * 开发环境为我的测试账号
 */
import fs from 'node:fs';

export default {
    appid: 'wx8b9f51d49e3a7a55',
    secret: '8f4c2be50d84f7b8071748a111b84b95',
    mchid: '1710304781', // 微信商户号
    private_key: fs.readFileSync('cert/1710304781/apiclient_key.pem').toString(), // 微信商户私钥
    serial_no: '2841C23DCDE8B701726E199976BB75764937ED49',  // 微信商户证书序列号
    apiv3_private_key: '2MEA8rnt9pg2mea8rnt9pg2mea8rnt99', // 微信商户apiv3私钥
    notify_url: 'https://api.verlantum.cn/wx/notify_url' // 微信支付回调地址
}