import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { message, App } from "antd";
import { z } from "zod";
import Logo from "../../layout/components/sidebar/logo";
// import LocaleButton from "../../components/common/LocaleButton";
import {
  setTokenToLocalStorage,
  formFieldValidator,
  getTokenFromLocalStorage,
} from "../../utils";
// import { loginApi } from "./api";
import useStore from "../../store";
import { useEffect } from "react";

function Login() {
  const closeLoading = useStore((state) => state.closeLoading);
  const openLoading = useStore((state) => state.openLoading);
  const token = getTokenFromLocalStorage();
  const rules = {
    username: [formFieldValidator<string>(z.string().min(1), "账号不能为空")],
    password: [formFieldValidator<string>(z.string().min(1), "密码不能为空")],
  };

  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  /**
   * @name 提交表单
   */

  const onSubmit = async () => {
    try {
      openLoading();
      //校验表单规则
      const values = await form.validateFields();
      const res = {
        code: 200,
        data: "safdsfsa",
        message: "登录成功",
      }; //await loginApi<string | undefined>(values);
      if (res.code === 200) {
        message.success("登录成功");
        setTokenToLocalStorage(res.data);
        navigate("/", {
          replace: true,
        });
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeLoading();
    }
  };
  return (
    <div className="flex w-full h-screen loginBox">
      {/* <div className="p-2 block text-right w-full xl:w-[1024px]">
        <LocaleButton />
      </div> */}
      <div className="m-auto">
        <Logo className="flex items-center justify-center mb-2" />
        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          initialValues={{
            username: "admin",
            password: "123456",
          }}
          className="border rounded-md shadow-md py-8 px-4 w-[350px]"
        >
          <Form.Item label="账号" name="username" rules={rules.username}>
            <Input className="rounded" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={rules.password}>
            <Input className="rounded" type="password" />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button className="w-full" type="primary" onClick={onSubmit}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
