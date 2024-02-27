import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Flex, message } from "antd";
import axios from "axios";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { DataCampagne } from "../../model/Campagne.model";

const UpdateCampagne: React.FC = () => {
  const [form] = Form.useForm();
  const [campagne, setCampagne] = useState<DataCampagne>({
    id: "",
    libelle: "",
    reference: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    montantCible: 0,
    montantActuel: 0,
    montantKit: 0,
    montantDonFixe: 0,
    nombreDon: 0,
    banniere: "",
    dateCreation: "",
    dateModification: "",
    supprime: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/campagnes/${id}`
      )
      .then((res) => {
        setCampagne(res.data);
        form.setFieldsValue(res.data);
      })
      .catch((err) => {
        console.log("Error from Update", err);
      });
  }, [id, form]);

  const onFinish = (values: any) => {
    const data = {
      ...campagne,
      ...values,
    };

    axios
      .put(
        `https://wesaloapi-dsiwessalo-dev.apps.malaaw-rec.orange-sonatel.com/api/campagnes/${id}`,
        data
      )
      .then((res) => {
        message.success("Campagne mise à jour avec succès !");
        navigate("/campagne");
      })
      .catch((err) => {
        console.log("Error in Update!", err);
        message.error("Erreur lors de la mise à jour de la campagne.");
      });
  };

  const handleCancel = () => {
    navigate("/campagne");
  };

  return (
    <Form
      size="large"
      style={{ marginTop: "70px",marginRight:"70px" }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      form={form}
      onFinish={onFinish}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div>
          <Form.Item label="Libelle" name="libelle">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Description" name="description">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Date-Debut" name="dateDebut">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Date-Fin" name="dateFin">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Montant-Cible" name="montantCible">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Montant-Kit" name="montantKit">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Montant-Actuel" name="montantActuel">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Montant-Don-Fixe" name="montantDonFixe">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Reference" name="reference">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Date-Creation" name="dateCreation">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="Banniere" name="banniere">
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
        </div>
      </div>

      <div style={{ display: "flex", marginLeft: "430px" }}>
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
              Update Campagne
            </Button>
          </Flex>
        </div>
      </div>
    </Form>
  );
};

export default UpdateCampagne;
