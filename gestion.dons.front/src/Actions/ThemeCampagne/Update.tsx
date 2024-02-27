import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button,message } from 'antd';
import axios from 'axios';
import DataThemeCampagne from '../../model/theme-campagne.model';
import { EditOutlined,CloseOutlined } from '@ant-design/icons';

const Update: React.FC = () => {
  const [form] = Form.useForm();
  const [themeCampagne, setThemeCampagne] = useState<DataThemeCampagne>({
    id: '',
    libelle: '',
    description: '',
    supprime: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes/${id}`)
      .then((res) => {
        setThemeCampagne({
          id: res.data.id,
          libelle: res.data.libelle,
          description: res.data.description,
          supprime:res.data.supprime,
        });
        form.setFieldsValue({
          libelle: res.data.libelle,
          description: res.data.description,
        });
      })
      .catch((err) => {
        console.log('Error from Update');
      });
  }, [id, form]);

  const onFinish = (values: any) => {
    const data = {
      id: themeCampagne.id,
      libelle: values.libelle,
      description: values.description,
      supprime:false,
    };

    axios
      .put(`https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/theme-campagnes/${id}`, data)
      .then((res) => {
        message.success("theme campagne mise à jour avec succes! ");
        navigate('/themeCampagne');
      })
      .catch((err) => {
        console.log('Error in Update!');
        
      });
  };

  const handleCancel = () => {
    navigate('/themeCampagne');
  };

  return (
    <div className='UpdateThemeCampagne'>
      <div className='col-md-8 m-auto'>
        <Form
        style={{marginTop:"50px",alignItems:"center"}}
        size='large'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
          name='updateCategorieForm'
          onFinish={onFinish}
          initialValues={{
            libelle: themeCampagne.libelle,
            description: themeCampagne.description,
          }}
        >
          <Form.Item
            label='Libelle'
            name='libelle'
          >
            <Input style={{borderRadius:"0px"}}  />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
          >
            <Input style={{borderRadius:"0px"}} />
          </Form.Item>

       
      <div style={{ display: "flex", marginLeft: "420px" }}>
      <div>
          <Button
            style={{
              background: "black",
              color: "white",
              borderRadius: "0px",
            }}
            icon={<CloseOutlined />}
            size="large"
            onClick={handleCancel}
          >
            Annuler
          </Button>
        </div>
        <div style={{ margin: "0 10px" }}>
          <Button
            style={{
              background: "#FF7900",
              color: "white",
              borderRadius: "0px",
            }}
            icon={<EditOutlined />}
            size="large"
            htmlType="submit"
          >
            Update Theme Campagne
          </Button>
        </div>
      
      </div>
        </Form>
      </div>
    </div>
  );
};

export default Update;
