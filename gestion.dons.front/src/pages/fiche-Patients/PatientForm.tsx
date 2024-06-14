import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import "./fiche.css";
import PatientService from "../../services/PatientService";

const { Option } = Select;

const PatientForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/patient");
  };

  useEffect(() => {
    if (id) {
      PatientService.getPatientById(id)
        .then((res) => {
          setPatient(res);
          form.setFieldsValue(res);
        })
        .catch((err) => {
          console.log("Erreur lors de la récupération du patient:", err);
        });
    }
  }, [id, form]);

  const handleSavePatient = async (values) => {
    try {
      const data = {
        id: patient?.id,
        ...patient,
        ...values,
      };

      let savedPatient;
      if (patient) {
        savedPatient = await PatientService.updatePatient(id, data);
      } else {
        savedPatient = await PatientService.createPatient(data);
      }

      message.success("Patient enregistré avec succès !");
      navigate("/patient");
    } catch (error) {
      console.log("Erreur lors de l'enregistrement du patient:", error);
      message.error("Erreur lors de l'enregistrement du patient.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-3">
        {patient
          ? "Formulaire de modification d'un patient"
          : "Formulaire d'ajout d'un patient"}
      </h1>

      <Form
        style={{ marginTop: "50px" }}
        form={form}
        autoComplete="off"
        layout="horizontal"
        size="large"
        className="custom-form"
        initialValues={patient}
        onFinish={handleSavePatient}
      >
        <div className="grid grid-cols-2 gap-y-1 gap-x-32">
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

          <Form.Item
            label="Nom"
            name="nom"
            rules={[
              { required: true, message: "Veuillez renseigner le champ Nom" },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Type Identification" name="typeIdentification">
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

          <Form.Item label="Numéro Identification" name="numeroIdentification">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: "Veuillez renseigner le champ Age" },
            ]}
          >
            <Input style={{ borderRadius: 0 }} type="number" />
          </Form.Item>

          <Form.Item label="Adresse" name="adresse">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Maladie" name="maladie">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Details" name="details">
            <Input.TextArea style={{ borderRadius: 0 }} />
          </Form.Item>

          <Form.Item label="Numero-Telephone" name="numeroTelephone">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-4">
          <div>
            <Button
              className="white-button"
              onClick={handleCancel}
              style={{ borderRadius: "0px" }}
            >
              <span className="mr-2">
                <CloseOutlined />
              </span>
              Annuler
            </Button>
          </div>
          <div style={{ margin: " 0 10px" }}>
            <Button
              className="button-orange"
              htmlType="submit"
              style={{ borderRadius: "0px" }}
            >
              <span className="mr-2">
                <SaveOutlined />
              </span>
              Enregistrer
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PatientForm;
