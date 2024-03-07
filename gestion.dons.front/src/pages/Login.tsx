import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate(); // Appel du hook useNavigate à l'intérieur du composant

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    // Simuler une connexion réussie ici
    onLogin();
    navigate("/dashboard"); // Utilisation de navigate pour rediriger vers /dashboard
  };

  return (
    <Row justify="center" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Col xs={24} sm={16} md={12} lg={10} xl={8}>
        <div style={{ backgroundColor: 'black', height: '100%', padding: '2rem' }}>
          <h2 style={{ color: 'white' }}>Welcome Back!</h2>
          <p style={{ color: 'white' }}>Please login to your account.</p>
        </div>
      </Col>
      <Col xs={24} sm={16} md={12} lg={14} xl={16}>
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
          <h2>Login</h2>
          <Form
            name="login-form"
            initialValues={{ remember: false }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
