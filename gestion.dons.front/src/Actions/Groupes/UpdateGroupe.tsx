import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
const { Option } = Select;

const UpdateGroupe: React.FC = () => {
  const [form] = Form.useForm();
  const [groupe, setGroupe] = useState({
    id: "",
    libelle: "",
    description: "",
    ninea: "",
    codeMarchand: "",
    rccm: "",
    numeroTelephone: "",
    typeGroupe: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes/${id}`
      )
      .then((res) => {
        setGroupe(res.data);
        form.setFieldsValue(res.data);
      })
      .catch((err) => {
        console.log("Error from Update");
      });
  }, [id, form]);

  const onFinish = (values: any) => {
    axios
      .put(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/groupes/${id}`,
        { ...groupe, ...values }
      )
      .then(() => {
        message.success("groupe mise à jour avec succès !");
        navigate("/groupe");
      })
      .catch((err) => {
        console.log("Error in Update!");
        message.error("error lors de la mise à jour  ");
      });
  };

  const handleCancel = () => {
    navigate("/groupe");
  };

  const handleTypeGroupeChange = (value: string) => {
    setGroupe({ ...groupe, typeGroupe: value });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={groupe}
      size="large"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{ marginTop: "50px" }}
      name="updateGroupeForm"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div>
          <Form.Item label="Libelle" name="libelle">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Ninea" name="ninea">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Rccm" name="rccm">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Description" name="description">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Code-Marchand" name="codeMarchand">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Telephone" name="numeroTelephone">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item label="Type Groupe" name="typeGroupe">
            <Select
              showSearch
              placeholder="Sélectionner le type de groupe"
              optionFilterProp="children"
              onChange={handleTypeGroupeChange}
            >
              <Option value="RSE">RSE</Option>
              <Option value="ASSOCIATION">ASSOCIATION</Option>
              <Option value="AUTRE">AUTRE</Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <div style={{ display: "flex", marginLeft: "500px" }}>
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
            Update Groupe
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default UpdateGroupe;
