import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Space,message, DatePicker } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons"; 
import axios from "axios";

import { DataCategorieTheme } from "../../model/categorie-theme.model";

const UpdateCategorie: React.FC = () => {
  const [form] = Form.useForm();
  const [themeCategorie, setThemeCategorie] = useState<DataCategorieTheme>({
    id: "",
    libelle: "",
    description: "",  
    dateCreation:"",
    dateModification:"",
    supprime: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/categorie-themes/${id}`
      )
      .then((res) => {
        setThemeCategorie({
          id: res.data.id,
          libelle: res.data.libelle,
          description: res.data.description,
          dateCreation:res.data.dateCreation,
          dateModification:res.data.dateModification, 
          supprime:res.data.supprime,
        });
        form.setFieldsValue({
          libelle: res.data.libelle,
          description: res.data.description,
          
        });
      })
      .catch((err) => {
        console.log("Error from Update");
      });
  }, [id, form]);

  const onFinish = (values: any) => {
    const data = {
      id: themeCategorie.id,
      libelle: values.libelle,
      description: values.description,
     
      supprime:false
    };

    axios
      .put(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/categorie-themes/${id}`,
        data
      )
      .then((res) => {
        message.success("categorie theme mise à jour avec succes! ");
        navigate("/categorieTheme");
      })
      .catch((err) => {
        console.log("Error in update");
      });
  };

  const handleCancel = () => {
    navigate("/categorieTheme");
  };

  return (
    <div className="UpdateThemeCampagne">
      <div className="col-md-8 m-auto">
        <Form
          style={{ marginTop: "50px",alignItems:"center" }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
          size="large"
          name="updateCategorieForm"
          onFinish={onFinish}
          initialValues={{
            libelle: themeCategorie.libelle,
            description: themeCategorie.description,
            
          }}
        >
          <Form.Item label="Libelle" name="libelle">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        

          <div style={{ marginLeft: "420px" }}>
            <Form.Item>
              <Space style={{marginRight:"40px"}}>
               
                <Button
                  type="default"
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  style={{
                    borderRadius: 0,
                    color: "white",
                    background: "black",
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<EditOutlined />}
                  style={{ background: "#FF7900", borderRadius: 0 }}
                >
                  Update Theme Categorie
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCategorie;
