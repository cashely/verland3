import { useEffect } from "react";
import { Dropdown, Space, message, Progress, Flex } from "antd";
import { useShallow } from "zustand/react/shallow";
import styles from "./index.module.scss";
// import LocaleButton from "../common/LocaleButton";

import { removeTokenFromLocalStorage } from "../../../utils";
// import { getCurrentUserApi, logoutApi } from "./apis";
// import CreateUserButton from "./CreateUserButton";
// import useStore from "../../store";

function Header() {
  //   const { userInfo, fetchUserInfo } = useStore(
  //     useShallow(({ userInfo, updateUserInfo, fetchUserInfo }) => ({
  //       userInfo,
  //       updateUserInfo,
  //       fetchUserInfo,
  //     }))
  //   );
  // fetchUserInfo()
  const menuItems: any = [
    {
      label: (
        <Flex className="text-gray-400">
          <span className="mr-2">邀请码:</span>
          {/* {userInfo.inviteCode} */}
        </Flex>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    //     {
    //       label: (
    //         <CreateUserButton>
    //           {(_, setVisible) => <a onClick={() => setVisible(true)}>创建用户</a>}
    //         </CreateUserButton>
    //       ),
    //       key: "1",
    //     },
    {
      label: <a onClick={onLogout}>退出登录</a>,
      key: "2",
    },
  ];

  /**
   * @name 获取当前用户信息
   */
  //   async function getCurrentUser() {
  //     fetchUserInfo(getCurrentUserApi<any>);
  //   }

  /**
   * @name 退出登录
   */
  async function onLogout() {
    const res = { code: 200 }; //await logoutApi<any>();
    if (res.code === 200) {
      removeTokenFromLocalStorage();
      message.success("退出成功");
      window.location.href = "/#/login";
    }
  }

  //   useEffect(() => {
  //     getCurrentUser();
  //   }, []);

  return (
    <header
      className={`${styles.header} flex justify-between p-2 border-b h-[64px] header`}
    >
      <Flex className="items-center content-center w-[150px]">
        <span className="mr-2 text-nowrap">容量:</span>
        {/* <Progress
            percent={(userInfo.documentCount / userInfo.stock) * 100}
            format={() => `${userInfo.documentCount} / ${userInfo.stock}`}
          /> */}
      </Flex>
      {/* <LocaleButton /> */}
      {/* <Button icon={<TranslationOutlined />} color='primary' variant='link' /> */}
      <Dropdown
        menu={{
          items: menuItems,
        }}
        placement="bottomRight"
      >
        <Space>
          <div className="flex items-center gap-2">
            <span
              className="border rounded-full block text-sm w-[25px] h-[25px] overflow-hidden text-center line-[25px] bg-gray-200 bg-cover bg-center"
              //     style={{
              //       backgroundImage: `url(${userInfo.avatar})`,
              //     }}
            ></span>
            111
            {/* {userInfo.username} */}
          </div>
        </Space>
      </Dropdown>
    </header>
  );
}

export default Header;
