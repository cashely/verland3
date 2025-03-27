/**
 * 微信相关功能
 */
import axios from "axios"
import wxconf from '../configs/wx.config'
/**
 * 获取sccess_token
 */
async function getAccessToken() {
    let params = {
        grant_type: 'client_credential',
        appid: wxconf.appid,
        secret: wxconf.secret
    }

    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token`, {
        params
    });

    return response.data.access_token; // 返回 access_token
}

/**
 * 调用微信模版发送模版消息
 */
export async function sendTemplateMessage(options = {
    openid,
    templateId,
    url,
    data
}) {
    const accessToken = await getAccessToken(); // 获取 access_token
    let params = {
        touser: options.openid,
        template_id: options.templateId,
        page: options.url,
        data: options.data,
    }
    try {
        const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`, params);
        
        if (response.data.errcode !== 0) {
            console.log('消息发送失败:', response.data.errmsg)
        }
        return response.data;
    } catch (error) {
        console.log('消息发送失败:', error)
        return null;
    }
}