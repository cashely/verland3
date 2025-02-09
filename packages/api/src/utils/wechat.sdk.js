import $ from "axios";
import wxConfig from "../configs/wx.config";
import loginRouter from "../routes/login";


function WechatSDK(options) {
    console.log(options)
    this.appid = options.appid;
    this.secret = options.secret;
    this.prefix = 'https://api.weixin.qq.com';
}

WechatSDK.prototype.get = function (...args) {
    const [url, ...otherArgs] = args;
    return $.get(`${this.prefix}${url}`, ...otherArgs);
}

WechatSDK.prototype.code2Session = async function (code) {
    const res = await this.get('/sns/jscode2session', {
        params: {
            appid: this.appid,
            secret: this.secret,
            js_code: code,
            grant_type: 'authorization_code'
        }
    });
    if (res.status === 200 && !res.data.errcode) {
        return res.data;
    } else {
        throw new Error(res.data.errmsg);
    }
    
}

const wechatSdk = new WechatSDK(wxConfig);

export default wechatSdk;