const regexObj = {
  // 邮箱
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
  // 手机号
  phone: /^1[3456789]\d{9}$/,
};

export default regexObj;
