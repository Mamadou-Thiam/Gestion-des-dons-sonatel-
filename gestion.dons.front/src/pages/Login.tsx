import React, { useState } from 'react';
import { Form, Input, Button, Image } from 'antd';

import IbouSvg from '../assets/images/login/ibou-desktop.svg';
import Logo from '../assets/images/logo-orange.png';


const Login: React.FC = ()=> {
 
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Colonne gauche */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5rem',
          padding: '2rem',
          backgroundColor: '#333',
        }}
      >
        <Image src={Logo} height={60} width={60} />
        <Image src={IbouSvg} height={300} width={500} preview={false} />
        <h1 className='text-white text-[40px] font-bold mt-5'>
          Wesalo Backoffice
        </h1>
      </div>
      
      {/* Colonne droite */}
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#f0f0f0',
        }}
      >
        <h1 className='mb-10 text-[40px] font-bold'>Connexion</h1>
        <Form
          name='basic'
          
        >
          <Form.Item
            label='Login Windows'
            name='username'
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input size='large' />
          </Form.Item>

          <Form.Item
            label='Mot de passe'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password size='large' />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" >
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
