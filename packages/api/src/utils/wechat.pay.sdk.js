import Payment  from 'wechatpay-node-v3';
import wxConfig from '../configs/wx.config';

const payment  = new Payment(wxConfig);

export default payment;