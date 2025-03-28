import { createContext } from 'react';

const AppContext = createContext({
  menuList: [],
  test: 1,
  // 其他需要共享的数据
});

export default AppContext;
