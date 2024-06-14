import React, { useEffect, useState } from "react";
import IbouSvg from "../assets/images/login/undraw_login_re_4vu2.svg";
// import Logo from "../assets/images/logo-orange.png";
import { Form, Input, Button, Modal } from "antd";
import {
  connectUser,
  getUserToken,
  // isTokenExpired,
  saveUserToken,
} from "../services/KeycloakService";
import { useNavigate } from "react-router";
import { use } from "i18next";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getUserToken()) {
      navigate("/dashboard");
    }
  }, []);
  const submitLogin = ({ username, password }) => {
    setLoading(true);
    connectUser(username, password)
      .then((res) => {
        console.log(res);
        saveUserToken(res.data);
        navigate("/dashboard");
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        Modal.error({
          content:
            "Une erreur s'est produite. Veuillez vérifier votre Login et mot de passe",
        });
      })
      .finally(() => setLoading(true));
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-100 lg:w-2/6 login-left bg-black flex flex-col items-center justify-center gap-5">
        {/* <img src={Logo} alt="Logo" height={60} width={60} /> */}
        <img src={IbouSvg} alt="Ibou" height={300} width={500} />
        <h1 className="text-white text-[40px] font-bold mt-5">Wesalo</h1>
      </div>
      <div className="w-100 lg:w-4/6 flex justify-center items-center my-[50px] lg:my-0">
        <div className="min-w-[50%]">
          <h1 className="mb-10 text-[40px] font-bold">Connexion</h1>
          <Form
            name="basic"
            className="login-form"
            autoComplete="off"
            onFinish={submitLogin}
          >
            <Form.Item
              label="Login Windows"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input size="large" className="rounded-none" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password size="large" className="rounded-none" />
            </Form.Item>
            <Form.Item className="flex items-center justify-center">
              <Button className="button-orange rounded-none" htmlType="submit">
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
