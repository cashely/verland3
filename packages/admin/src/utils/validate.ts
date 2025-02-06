export function isExternal(path: string) {
      return /^(https?:|mailto:|tel:)/.test(path)
}
export const regexObj = {
      eMailReg: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      positiveInteger: /^[0-9]*[1-9][0-9]*$/, //输入正整数
      integerEnglish: /^[a-zA-Z0-9]+$/, //输入英文+数字
    };
    