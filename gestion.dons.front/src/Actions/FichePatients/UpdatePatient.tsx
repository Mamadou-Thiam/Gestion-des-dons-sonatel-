import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Flex, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { DataPatient } from "../../model/fiche-patient.model";

const UpdatePatient: React.FC = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [patient, setPatient] = useState<DataPatient>({
    id: "",
    nom: "",
    prenom: "",
    age: 0,
    adresse: "",
    maladie: "",
    details:"",
    numeroTelephone: "",
    numeroIdentification: "",
    typeIdentification: "",
    dateModification: "",
    dateCreation: "",
    supprime: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/fiche-patients/${id}`
      )
      .then((res) => {
        setPatient({
          id: res.data.id,
          nom: res.data.nom,
          prenom: res.data.prenom,
          age: res.data.age,
          adresse: res.data.adresse,
          maladie: res.data.maladie,
          details:res.data.details,
          supprime: res.data.supprime,
          numeroTelephone: res.data.numeroTelephone,
          numeroIdentification: res.data.numeroIdentification,
          typeIdentification: res.data.typeIdentification,
          dateCreation: res.data.dateCreation,
          dateModification: res.data.dateModification,
        });
        form.setFieldsValue({
          nom: res.data.nom,
          prenom: res.data.prenom,
          age: res.data.age,
          adresse: res.data.adresse,
          maladie: res.data.maladie,
          details:res.data.details,
          numeroTelephone: res.data.numeroTelephone,
          numeroIdentification: res.data.numeroIdentification,
          typeIdentification: res.data.typeIdentification,
          dateCreation: res.data.dateCreation,
          dateModification: res.data.dateModification,
        });
      })
      .catch((err) => {
        console.log("Error from Update");
      });
  }, [id, form]);

  const onFinish = (values: any) => {
    const data = {
      id: patient.id,
      nom: values.nom,
      prenom: values.prenom,
      age: values.age,
      adresse: values.adresse,
      maladie: values.maladie,
      details:values.details,
      numeroTelephone: values.numeroTelephone,
      numeroIdentification: values.numeroIdentification,
      typeIdentification: values.typeIdentification, 
      dateCreation: values.dateCreation,
      dateModification: values.dateModification,
      supprime: false,
    };

    axios
      .put(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/fiche-patients/${id}`,
        data
      )
      .then((res) => {
        message.success("Patient mise à jour avec succès !");
        navigate("/patient");
      })
      .catch((err) => {
        console.log("Error in Update!");
        message.error("Erreur lors de la mise à jour de la campagne.");
      });
  };

  const handleCancel = () => {
    navigate("/patient");
  };

  return (
    <Form
      size="large"
      style={{ marginTop: "50px" }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      form={form}
      name="updatePatientForm"
      onFinish={onFinish}
      initialValues={{
        nom: patient.nom,
        prenom: patient.prenom,
        age: patient.age,
        adresse: patient.adresse,
        maladie: patient.maladie,
        details:patient.details,
        numeroTelephone: patient.numeroTelephone,
        numeroIdentification: patient.numeroIdentification,
        typeIdentification: patient.typeIdentification,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          marginRight: "60px",
        }}
      >
        <div>
          <Form.Item label="Prenom" name="prenom">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Nom" name="nom">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Adresse" name="adresse">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Age" name="age">
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
          <Form.Item
            label="Numéro-Identification"
            name="numeroIdentification"
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="Numéro-Téléphone"
            name="numeroTelephone"
          >
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
              defaultValue={patient.typeIdentification}
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

      <div
        style={{
          display: "flex",
          marginLeft: "500px",
          marginTop: "20px",
        }}
      >
        <div>
          <Flex gap="large" wrap="wrap">
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
          </Flex>
        </div>
        <div style={{ margin: "0 10px" }}>
          <Flex gap="large" wrap="wrap">
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
              Update Patient
            </Button>
          </Flex>
        </div>
      </div>
    </Form>
  );
};

export default UpdatePatient;
