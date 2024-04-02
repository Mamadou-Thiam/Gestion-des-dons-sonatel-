import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import "./fiche.css";
import { DataPatient } from "../../model/fiche-patient.model";
const { Option } = Select;

const PatientForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [patient, setPatient] = useState<DataPatient>();

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/patient");
  };
  useEffect(() => {
    if (id) {
      axios
        .get(`/fiche-patients/${id}`)
        .then((res) => {
          setPatient(res.data);
          form.setFieldsValue(res.data);
        })
        .catch((err) => {
          console.log("Error from Update");
        });
    }
  }, [id, form]);

  const handleSavePatient = async (values) => {
    const data = {
      id: patient?.id,
      ...patient,
      ...values,
    };

    const promise = patient
      ? axios.put(`/fiche-patients/${id}`, data)
      : axios.post("/fiche-patients", data);

    promise
      .then((res) => {
        message.success("Patient enregistré avec succès !");
        navigate("/patient");
      })
      .catch((err) => {
        console.log(err);
        console.log("Error in Save!");
        message.error("Erreur lors de l'enregistrement du patient.");
      });
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

        <div className="flex items-center justify-center mt-20">
          <div className="w-full">
            <Button
              className="bg-orange-500 text-white rounded-0 border-none w-full"
              onClick={handleCancel}
            >
              <span className="mr-2">
                <CloseOutlined />
              </span>
              Annuler
            </Button>
          </div>
          <div className="w-full mx-10 ">
            <Button
              className="bg-black text-white rounded-0 border-none w-full"
              htmlType="submit"
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
