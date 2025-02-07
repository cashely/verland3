import $ from "axios";
import wxConfig from "../configs/wx.config";
import loginRouter from "../routes/login";


function WechatSDK(options) {
    this.appid = options.appid;
    this.appsecret = options.appsecret;
    this.prefix = 'https://api.weixin.qq.com';
}

WechatSDK.prototype.get = function (...args) {
    return $.get(args);
}

WechatSDK.prototype.code2Session = async function (code) {
    const res = await this.get('/sns/jscode2session', {
        appid: this.appid,
        secret: this.secret,
        js_code: code,
        grant_type: 'authorization_code'
    });
    console.log(res, '<------------code2Session的返回')
}

const wechatSdk = new WechatSDK(wxConfig);

export default wechatSdk;