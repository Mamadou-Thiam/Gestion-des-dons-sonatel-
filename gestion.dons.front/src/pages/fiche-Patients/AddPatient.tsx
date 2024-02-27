import React from "react";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Option } = Select;

const AddPatient: React.FC = () => {
  const [form] = Form.useForm();
const navigate=useNavigate()
  const handleCancel = () => {
    form.resetFields();
  };

  const handleSavePatient = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        prenom: values.prenom,
        nom: values.nom,
        age: values.age,
        adresse: values.adresse,
        maladie: values.maladie,
        details:values.details,
        numeroTelephone: values.numeroTelephone,
        numeroIdentification: values.numeroIdentification,
        typeIdentification: values.typeIdentification,
      };

      await axios.post(
        "https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/fiche-patients",
        data
      );

      message.success("Patient ajouté avec succès.");
      navigate("/patient")
    } catch (error) {
      console.error("Validation Failed:", error);
      message.error("Erreur lors de l'ajout du patient.");
    }
  };

  return (
    <>
    <h1>Formulaire d'ajout d'un patient</h1>
     <Form
      style={{ marginTop: "50px", marginLeft: "70px" }}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: "large" }}
      size="large"
    >

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div>
          <Form.Item
            label="Prenom"
            name="prenom"
            rules={[
              {
                required: true,
                message: "Veuillez renseigner le champ Prénom",
              },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[
              { required: true, message: "Veuillez renseigner le champ Nom" },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Numéro Identification"
            name="numeroIdentification"
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Veuillez renseigner le champ Age" },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div>
          <Form.Item label="Adresse" name="adresse">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Maladie" name="maladie">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Details" name="details">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Numero-Telephone" name="numeroTelephone">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Type Identification"
            name="typeIdentification"
          
          >
            <Select
              showSearch
              placeholder="Sélectionner le type d'identification"
              optionFilterProp="children"
            >
              <Option value="CNI">CNI</Option>
              <Option value="PASSPORT">PASSPORT</Option>
              <Option value="EXTRAIT_NAISSANCE">EXTRAIT_NAISSANCE</Option>
              <Option value="CARTE_REFUGIE">CARTE_REFUGIE</Option>
              <Option value="AUTRE">AUTRE</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div style={{ display: "flex", marginLeft: "500px", marginTop: "20px" }}>
        <div>
          <Button
            style={{
              background: "#FF7900",
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
              background: "black",
              color: "white",
              borderRadius: "0px",
            }}
            icon={<SaveOutlined />}
            size="large"
            onClick={handleSavePatient}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Form>
    </>
   
  );
};

export default AddPatient;
