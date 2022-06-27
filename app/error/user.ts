export const userErrorMessages = {
  inputValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  createUserExistsFail: {
    errno: 101002,
    message: '用户已存在, 请直接登录',
  },
  loginCheckFail: {
    errno: 101003,
    message: '用户名或密码验证失败',
  },
  loginValidateFail: {
    errno: 101004,
    message: '登录校验失败',
  },
  sendVeriCodeFrequentlyFail: {
    errno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  loginByCellphoneCheckFail: {
    errno: 101006,
    message: '验证码错误',
  },
  sendVeriCodeFail: {
    errno: 101007,
    message: '验证码发送失败',
  },
  giteeOauthFail: {
    errno: 101008,
    message: 'gitee 授权失败',
  },
  createUserFail: {
    errno: 101009,
    message: '用户创建失败',
  },
  userNoPermissionFail: {
    errno: 101010,
    message: '没有权限完成操作',
  },
};
